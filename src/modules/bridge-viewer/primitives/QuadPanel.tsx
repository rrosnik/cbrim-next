
"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Edges } from "@react-three/drei";

type QuadPanelProps = {
  points: [number, number, number][];
  color: string;
  opacity?: number;
  edgeColor?: string;
  onClick?: (event: unknown) => void;
  onPointerOver?: (event: unknown) => void;
  onPointerOut?: (event: unknown) => void;
};

export function QuadPanel({
  points,
  color,
  opacity = 0.22,
  edgeColor = "#334155",
  onClick,
  onPointerOver,
  onPointerOut,
}: QuadPanelProps) {
  const geometry = useMemo(() => {
    const vertices = new Float32Array([
      ...points[0], ...points[1], ...points[2],
      ...points[0], ...points[2], ...points[3],
    ]);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    g.computeVertexNormals();
    return g;
  }, [points]);

  return (
    <mesh
      geometry={geometry}
      onClick={onClick as never}
      // onPointerOver={onPointerOver as never}
      // onPointerOut={onPointerOut as never}
    >
      <meshStandardMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
      <Edges threshold={1} color={edgeColor} />
    </mesh>
  );
}
