import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import {
  GizmoHelper,
  GizmoViewport,
  GizmoViewcube,
  Grid,
  MapControls,
} from "@react-three/drei";

const STORAGE_KEY = "live-coding-camera";

type StoredCamera = {
  position: [number, number, number];
  quaternion: [number, number, number, number];
  target: [number, number, number];
  zoom?: number;
};

export const PersistantMapControls = () => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const saved: StoredCamera = JSON.parse(raw);

      camera.position.fromArray(saved.position);
      camera.quaternion.fromArray(saved.quaternion);

      if ("zoom" in saved && typeof saved.zoom === "number") {
        camera.zoom = saved.zoom;
      }

      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();

      if (controlsRef.current) {
        controlsRef.current.target.fromArray(saved.target);
        controlsRef.current.update();
      }
    } catch (err) {
      console.error("Failed to restore camera", err);
    }
  }, [camera]);

  const saveCamera = () => {
    const controls = controlsRef.current;
    if (!controls) return;

    const data: StoredCamera = {
      position: camera.position.toArray() as [number, number, number],
      quaternion: camera.quaternion.toArray() as [
        number,
        number,
        number,
        number,
      ],
      target: controls.target.toArray() as [number, number, number],
      zoom: camera.zoom,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  return (
    <MapControls
      ref={controlsRef}
      onEnd={saveCamera}
      // use onChange={saveCamera} only if you want live persistence
    />
  );
};
