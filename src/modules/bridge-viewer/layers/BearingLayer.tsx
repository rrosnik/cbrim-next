
"use client";

import { Fragment, useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";

import type { BridgeModelExportV2, ViewerSelection } from "@/lib/bridge-viewer/types";
import { useBridgeViewerStore } from "@/lib/bridge-viewer/store";
import { isSelected } from "@/lib/bridge-viewer/utils";

type BearingLayerProps = {
  data: BridgeModelExportV2;
};

function makeSelection(kind: ViewerSelection["kind"], id: string | number, label: string, payload: unknown): ViewerSelection {
  return { kind, id, label, payload };
}

export function BearingLayer({ data }: BearingLayerProps) {
  const visibility = useBridgeViewerStore((state) => state.visibility.bearings);
  const groupVisibility = useBridgeViewerStore((state) => state.groupVisibility);
  const displayMode = useBridgeViewerStore((state) => state.displayMode);
  const selected = useBridgeViewerStore((state) => state.selected);
  const hovered = useBridgeViewerStore((state) => state.hovered);
  const setSelected = useBridgeViewerStore((state) => state.setSelected);
  const setHovered = useBridgeViewerStore((state) => state.setHovered);

  const bearingSceneRecords = data.scene.lines.bearing ?? [];
  const bearingMap = useMemo(() => new Map(data.bearings.map((bearing) => [bearing.element, bearing])), [data.bearings]);

  if (!visibility || !groupVisibility.bearing) return null;

  return (
    <group>
      {bearingSceneRecords.map((record) => {
        const bearing = bearingMap.get(record.element_tag);
        if (!bearing) return null;

        const selectedNow = selected?.kind === "bearing" && isSelected(record.element_tag, selected.id);
        const hoveredNow = hovered?.kind === "bearing" && isSelected(record.element_tag, hovered.id);
        const color = selectedNow ? "#f59e0b" : hoveredNow ? "#fde68a" : "#fbbf24";

        const points =
          displayMode === "undeformed"
            ? record.undeformed
            : displayMode === "deformed"
              ? record.plot_deformed
              : record.undeformed;

        const mid = new THREE.Vector3(
          (points[0][0] + points[1][0]) / 2,
          (points[0][1] + points[1][1]) / 2,
          (points[0][2] + points[1][2]) / 2,
        );

        return (
          <Fragment key={record.element_tag}>
            <Line
              points={points}
              color={color}
              lineWidth={selectedNow ? 4 : 2.6}
              onClick={(event) => {
                event.stopPropagation();
                setSelected(makeSelection("bearing", record.element_tag, `Bearing ${record.element_tag}`, bearing));
              }}
              // onPointerOver={(event) => {
              //   event.stopPropagation();
              //   setHovered(makeSelection("bearing", record.element_tag, `Bearing ${record.element_tag}`, bearing));
              // }}
              // onPointerOut={() => setHovered(null)}
            />
            <mesh
              position={mid}
              onClick={(event) => {
                event.stopPropagation();
                setSelected(makeSelection("bearing", record.element_tag, `Bearing ${record.element_tag}`, bearing));
              }}
              // onPointerOver={(event) => {
              //   event.stopPropagation();
              //   setHovered(makeSelection("bearing", record.element_tag, `Bearing ${record.element_tag}`, bearing));
              // }}
              // onPointerOut={() => setHovered(null)}
            >
              <boxGeometry args={[0.45, 0.45, Math.max(bearing.height, 0.2)]} />
              <meshStandardMaterial color={color} transparent opacity={0.72} />
            </mesh>
            {displayMode === "both" && (
              <Line points={record.plot_deformed} color="#fb7185" lineWidth={1.25} transparent opacity={0.9} />
            )}
          </Fragment>
        );
      })}
    </group>
  );
}
