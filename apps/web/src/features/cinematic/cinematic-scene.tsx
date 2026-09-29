"use client";

import { useRef } from "react";
import { useCinematicController } from "./use-cinematic-controller";
import styles from "./cinematic.module.css";

export function CinematicScene() {
  const root = useRef<HTMLDivElement>(null);
  useCinematicController(root);

  return <div ref={root} className={styles.scene} aria-hidden="true" />;
}
