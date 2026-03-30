
"use client";

import { useMemo } from "react";
import { Line } from "@react-three/drei";

import type { BridgeModelExportV2, ViewerSelection } from "@/lib/bridge-viewer/types";
import { useBridgeViewerStore } from "@/lib/bridge-viewer/store";
import { colorFromNormalized, getElementResultValue, getResultExtrema, groupBaseColor, isSelected } from "@/lib/bridge-viewer/utils";

type ElementLayerProps = {
  data: BridgeModelExportV2;
};

const structuralGroups = ["girder", "cap_beam", "abutment_beam", "column", "pile"] as const;

function makeSelection(kind: ViewerSelection["kind"], id: string | number, label: string, payload: unknown): ViewerSelection {
  return { kind, id, label, payload };
}

export function ElementLayer({ data }: ElementLayerProps) {
  const visibility = useBridgeViewerStore((state) => state.visibility.elements);
  const groupVisibility = useBridgeViewerStore((state) => state.groupVisibility);
  const displayMode = useBridgeViewerStore((state) => state.displayMode);
  const resultMode = useBridgeViewerStore((state) => state.resultMode);
  const selected = useBridgeViewerStore((state) => state.selected);
  const hovered = useBridgeViewerStore((state) => state.hovered);
  const setSelected = useBridgeViewerStore((state) => state.setSelected);
  const setHovered = useBridgeViewerStore((state) => state.setHovered);

  const elementMap = useMemo(() => new Map(data.elements.map((element) => [element.tag, element])), [data.elements]);
  const maxValue = useMemo(() => getResultExtrema(data, resultMode).maxValue, [data, resultMode]);

  if (!visibility) return null;

  return (
    <group>
      {structuralGroups.map((groupName) => {
        if (!groupVisibility[groupName]) return null;
        const records = data.scene.lines[groupName] ?? [];

        return records.map((record) => {
          const element = elementMap.get(record.element_tag);
          if (!element) return null;

          const selectedNow = selected?.kind === "element" && isSelected(record.element_tag, selected.id);
          const hoveredNow = hovered?.kind === "element" && isSelected(record.element_tag, hovered.id);
          const value = getElementResultValue(element, resultMode);
          const baseColor = resultMode === "elementForce"
            ? colorFromNormalized(value / maxValue)
            : groupBaseColor(groupName);

          const color = selectedNow ? "#f59e0b" : hoveredNow ? "#fde68a" : baseColor;
          const points =
            displayMode === "undeformed"
              ? record.undeformed
              : displayMode === "deformed"
                ? record.plot_deformed
                : record.undeformed;

          return (
            <group key={record.element_tag}>
              <Line
                points={points}
                color={color}
                lineWidth={selectedNow ? 3.5 : hoveredNow ? 3 : 2}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelected(makeSelection("element", record.element_tag, `Element ${record.element_tag}`, element));
                }}
                // onPointerOver={(event) => {
                //   event.stopPropagation();
                //   setHovered(makeSelection("element", record.element_tag, `Element ${record.element_tag}`, element));
                // }}
                // onPointerOut={() => setHovered(null)}
              />
              {displayMode === "both" && (
                <Line points={record.plot_deformed} color="#f43f5e" lineWidth={1.25} opacity={0.95} transparent />
              )}
            </group>
          );
        });
      })}
    </group>
  );
}
