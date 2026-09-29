"use client";

import { useRef } from "react";
import { useCinematicController } from "./use-cinematic-controller";
import styles from "./cinematic.module.css";

export function CinematicScene() {
  const root = useRef<HTMLDivElement>(null);
  const { snapshot, skip, togglePause } = useCinematicController(root);
  const active = snapshot.state === "playing" || snapshot.state === "paused";
  const preparing = snapshot.state === "preparing";

  return (
    <>
      <div ref={root} className={styles.scene} aria-hidden="true" data-scene-state={snapshot.state} />
      <div className={styles.controls} role="group" aria-label="Điều khiển chuyển động phong cảnh" data-cinematic-controls>
        {active || preparing ? (
          <>
            <button type="button" onClick={togglePause} disabled={preparing} aria-label={snapshot.state === "paused" ? "Tiếp tục chuyển động" : "Tạm dừng chuyển động"}>
              {snapshot.state === "paused" ? "Tiếp tục" : "Tạm dừng"}
            </button>
            <button type="button" onClick={skip} aria-label="Bỏ qua chuyển động">Bỏ qua</button>
          </>
        ) : null}
      </div>
      <span className={styles.status} role="status" aria-live="polite">
        {snapshot.state === "paused" ? "Chuyển động đã tạm dừng." : ""}
      </span>
    </>
  );
}
