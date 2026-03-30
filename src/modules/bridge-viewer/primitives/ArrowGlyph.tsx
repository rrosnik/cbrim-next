
"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";

type ArrowGlyphProps = {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  shaftWidth?: number;
  headSize?: number;
  opacity?: number;
  onClick?: (event: unknown) => void;
  onPointerOver?: (event: unknown) => void;
  onPointerOut?: (event: unknown) => void;
};

export function ArrowGlyph({
  start,
  end,
  color,
  shaftWidth = 1.5,
  headSize = 0.18,
  opacity = 1,
  onClick,
  onPointerOver,
  onPointerOut,
}: ArrowGlyphProps) {
  const { midpoint, direction, length, quaternion } = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const dir = new THREE.Vector3().subVectors(e, s);
    const len = Math.max(dir.length(), 1e-6);
    const unit = dir.clone().normalize();
    const mid = s.clone().lerp(e, 0.85);
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), unit);
    return {
      midpoint: mid,
      direction: unit,
      length: len,
      quaternion: quat,
    };
  }, [start, end]);

  return (
    <group>
      <Line
        points={[start, end]}
        color={color}
        lineWidth={shaftWidth}
        transparent
        opacity={opacity}
        onClick={onClick as never}
        // onPointerOver={onPointerOver as never}
        // onPointerOut={onPointerOut as never}
      />
      <mesh
        position={midpoint}
        quaternion={quaternion}
        onClick={onClick as never}
        // onPointerOver={onPointerOver as never}
        // onPointerOut={onPointerOut as never}
      >
        <coneGeometry args={[headSize, Math.min(headSize * 2.2, length * 0.22), 10]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}
