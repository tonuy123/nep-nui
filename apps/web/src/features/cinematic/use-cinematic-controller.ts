"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { createMountainRenderer } from "./mountain-renderer";
import type { MountainRenderer } from "./mountain-renderer";
import { sceneConfig } from "./scene-config";
import type { SceneState } from "./scene-config";

// Fresh documents play the intro; SPA navigation back home stays still.
let seenInMemory = false;

export function useCinematicController(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    const hero = root?.closest<HTMLElement>("[data-cinematic-hero]");
    const poster = hero?.querySelector<HTMLImageElement>("[data-scene-poster]");
    const title = hero?.querySelector<HTMLElement>("#hero-title");
    if (!root || !hero || !poster || !title) return;

    let disposed = false;
    let state: SceneState = "static";
    let renderer: MountainRenderer | null = null;
    let elapsed = 0, lastFrame = 0, frame = 0;
    let started = 0, finished = 0, generation = 0, deadline = 0;
    let hiddenPaused = false;
    let preparation: AbortController | null = null;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    function update(next: SceneState, reason: string) {
      if (disposed) return;
      state = next;
      hero!.dataset.sceneState = next;
      hero!.dataset.sceneReason = reason;
      hero!.dataset.sceneStarted = String(started);
      hero!.dataset.sceneFinished = String(finished);
    }

    function finish(reason: string, failed = false) {
      generation += 1;
      preparation?.abort(); preparation = null;
      window.clearTimeout(deadline); cancelAnimationFrame(frame); frame = 0;
      delete hero!.dataset.sceneBoot;
      elapsed = sceneConfig.duration;
      if (reason === "user-skip") seenInMemory = true;
      if (failed || reason === "reduced-motion") {
        renderer?.dispose(); renderer = null;
        root!.dataset.active = "false"; delete hero!.dataset.sceneRenderer;
      } else if (renderer) {
        try { renderer.draw(elapsed); }
        catch { renderer.dispose(); renderer = null; root!.dataset.active = "false"; delete hero!.dataset.sceneRenderer; failed = true; }
      }
      finished = performance.now();
      update(failed ? "failed" : "idle", reason);
    }

    function tick(time: number) {
      frame = 0;
      if (disposed || state !== "playing" || !renderer) return;
      if (media.matches) { finish("reduced-motion"); return; }
      if (lastFrame) elapsed += time - lastFrame;
      lastFrame = time;
      try { renderer.draw(Math.min(elapsed, sceneConfig.duration)); }
      catch { finish("render-error", true); return; }
      if (elapsed >= sceneConfig.duration) finish("completed");
      else frame = requestAnimationFrame(tick);
    }

    function play() {
      if (!renderer || disposed || media.matches || document.hidden) return;
      cancelAnimationFrame(frame); elapsed = 0; lastFrame = 0;
      hiddenPaused = false;
      try { renderer.resize(); renderer.draw(0); }
      catch { finish("render-error", true); return; }
      // Commit the enhancement only after a successful complete first draw.
      root!.dataset.active = "true"; hero!.dataset.sceneRenderer = "webgl";
      delete hero!.dataset.sceneBoot;
      seenInMemory = true; started = performance.now(); finished = 0;
      update("playing", "intro");
      frame = requestAnimationFrame(tick);
    }

    async function imageReady(image: HTMLImageElement, signal: AbortSignal) {
      if (signal.aborted) throw new Error("Scene disposed");
      if (!image.complete) await new Promise<void>((resolve, reject) => {
        const cleanup = () => {
          image.removeEventListener("load", loaded); image.removeEventListener("error", failed);
          signal.removeEventListener("abort", cancelled);
        };
        const loaded = () => { cleanup(); resolve(); };
        const failed = () => { cleanup(); reject(new Error("Photo unavailable")); };
        const cancelled = () => { cleanup(); reject(new Error("Scene disposed")); };
        image.addEventListener("load", loaded); image.addEventListener("error", failed);
        signal.addEventListener("abort", cancelled, { once: true });
      });
      if (!image.naturalWidth) throw new Error("Photo unavailable");
      await image.decode();
    }

    async function prepare(replay = false) {
      if (disposed) return;
      if (media.matches || (!replay && (seenInMemory || hero!.dataset.sceneBoot === "expired"))) {
        delete hero!.dataset.sceneBoot;
        update("static", media.matches ? "reduced-motion" : "document-seen"); return;
      }
      update("preparing", "loading-photo");
      preparation?.abort();
      const cancellation = new AbortController();
      preparation = cancellation;
      const attempt = ++generation;
      const current = () => !disposed && generation === attempt && state === "preparing";
      deadline = window.setTimeout(() => finish("assets-timeout", true), sceneConfig.readyDeadline);
      try {
        await Promise.all([imageReady(poster!, cancellation.signal), document.fonts.ready]);
        if (!current()) return;
        if (!replay && hero!.dataset.sceneBoot === "expired") { finish("boot-timeout", true); return; }
        const candidate = createMountainRenderer(root!, poster!, title!, () => finish("context-lost", true));
        if (!current()) { candidate.dispose(); return; }
        renderer = candidate; window.clearTimeout(deadline);
        preparation = null;
        if (document.hidden || hero!.getBoundingClientRect().bottom <= 0) { finish("not-visible"); return; }
        play();
      } catch {
        if (current()) finish("renderer-unavailable", true);
      }
    }

    function pause(reason: string) {
      cancelAnimationFrame(frame); frame = 0; lastFrame = 0; update("paused", reason);
    }
    function resume(reason: string) {
      lastFrame = 0; update("playing", reason);
      cancelAnimationFrame(frame); frame = requestAnimationFrame(tick);
    }

    const resize = new ResizeObserver(() => {
      try { renderer?.resize(); } catch { finish("resize-error", true); }
    });
    resize.observe(hero);
    const onScroll = () => { if (["preparing", "playing", "paused"].includes(state) && hero.getBoundingClientRect().bottom <= 0) finish("scroll-away"); };
    const onPreference = () => { if (media.matches) finish("reduced-motion"); else update("static", "motion-allowed"); };
    const onPageHide = () => { if (["preparing", "playing", "paused"].includes(state)) finish("navigation-away"); };
    const onVisibility = () => {
      if (document.hidden && state === "playing") { hiddenPaused = true; pause("tab-hidden"); }
      else if (!document.hidden && hiddenPaused && state === "paused") { hiddenPaused = false; resume("tab-visible"); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onVisibility);
    media.addEventListener("change", onPreference);
    void Promise.resolve().then(() => { if (!disposed) return prepare(); });

    return () => {
      disposed = true;
      generation += 1; preparation?.abort(); preparation = null; window.clearTimeout(deadline);
      cancelAnimationFrame(frame);
      renderer?.dispose(); resize.disconnect(); root.dataset.active = "false";
      delete hero.dataset.sceneRenderer;
      window.removeEventListener("scroll", onScroll); window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onVisibility); media.removeEventListener("change", onPreference);
    };
  }, [rootRef]);
}
