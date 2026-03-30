
"use client";

import { useMemo } from "react";

import { QuadPanel } from "@/modules/bridge-viewer/primitives/QuadPanel";
import type { BridgeModelExportV2, ViewerSelection } from "@/lib/bridge-viewer/types";
import { useBridgeViewerStore } from "@/lib/bridge-viewer/store";
import { buildNodeMap, colorFromNormalized, getResultExtrema, getShellResultValue, isSelected } from "@/lib/bridge-viewer/utils";

type ShellLayerProps = {
  data: BridgeModelExportV2;
};

function makeSelection(kind: ViewerSelection["kind"], id: string | number, label: string, payload: unknown): ViewerSelection {
  return { kind, id, label, payload };
}

export function ShellLayer({ data }: ShellLayerProps) {
  const visibility = useBridgeViewerStore((state) => state.visibility.shells);
  const groupVisibility = useBridgeViewerStore((state) => state.groupVisibility);
  const displayMode = useBridgeViewerStore((state) => state.displayMode);
  const resultMode = useBridgeViewerStore((state) => state.resultMode);
  const selected = useBridgeViewerStore((state) => state.selected);
  const hovered = useBridgeViewerStore((state) => state.hovered);
  const setSelected = useBridgeViewerStore((state) => state.setSelected);
  const setHovered = useBridgeViewerStore((state) => state.setHovered);

  const nodeMap = useMemo(() => buildNodeMap(data), [data]);
  const maxValue = useMemo(() => getResultExtrema(data, resultMode).maxValue, [data, resultMode]);

  if (!visibility || !groupVisibility.deck_shell) return null;

  return (
    <group>
      {(data.scene.shells.deck_shell ?? []).map((shell) => {
        const selectedNow = selected?.kind === "element" && isSelected(shell.element_tag, selected.id);
        const hoveredNow = hovered?.kind === "element" && isSelected(shell.element_tag, hovered.id);
        const value = getShellResultValue(shell.nodes, nodeMap, resultMode);
        const baseColor = resultMode === "displacement" ? colorFromNormalized(value / maxValue) : "#0ea5e9";
        const color = selectedNow ? "#f59e0b" : hoveredNow ? "#fde68a" : baseColor;
        const points =
          displayMode === "undeformed"
            ? shell.undeformed
            : displayMode === "deformed"
              ? shell.plot_deformed
              : shell.undeformed;

        const payload = data.elements.find((element) => element.tag === shell.element_tag) ?? shell;

        return (
          <group key={shell.element_tag}>
            <QuadPanel
              points={points}
              color={color}
              opacity={selectedNow ? 0.48 : 0.24}
              edgeColor={selectedNow ? "#fbbf24" : "#475569"}
              onClick={(event) => {
                event.stopPropagation();
                setSelected(makeSelection("element", shell.element_tag, `Shell ${shell.element_tag}`, payload));
              }}
              // onPointerOver={(event) => {
              //   event.stopPropagation();
              //   setHovered(makeSelection("element", shell.element_tag, `Shell ${shell.element_tag}`, payload));
              // }}
              // onPointerOut={() => setHovered(null)}
            />
            {displayMode === "both" && (
              <QuadPanel
                points={shell.plot_deformed}
                color="#f43f5e"
                opacity={0.12}
                edgeColor="#fb7185"
              />
            )}
          </group>
        );
      })}
    </group>
  );
}
