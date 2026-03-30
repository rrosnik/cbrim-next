
"use client";

import { Edges } from "@react-three/drei";

import type { BridgeModelExportV2, ViewerSelection } from "@/lib/bridge-viewer/types";
import { useBridgeViewerStore } from "@/lib/bridge-viewer/store";
import { isSelected } from "@/lib/bridge-viewer/utils";

type PileCapLayerProps = {
  data: BridgeModelExportV2;
};

function makeSelection(kind: ViewerSelection["kind"], id: string | number, label: string, payload: unknown): ViewerSelection {
  return { kind, id, label, payload };
}

export function PileCapLayer({ data }: PileCapLayerProps) {
  const visibility = useBridgeViewerStore((state) => state.visibility.pileCaps);
  const selected = useBridgeViewerStore((state) => state.selected);
  const hovered = useBridgeViewerStore((state) => state.hovered);
  const setSelected = useBridgeViewerStore((state) => state.setSelected);
  const setHovered = useBridgeViewerStore((state) => state.setHovered);

  if (!visibility) return null;

  return (
    <group>
      {data.scene.solids.pile_caps.map((pileCap) => {
        const selectedNow = selected?.kind === "pileCap" && isSelected(pileCap.pier_index, selected.id);
        const hoveredNow = hovered?.kind === "pileCap" && isSelected(pileCap.pier_index, hovered.id);
        const color = selectedNow ? "#f59e0b" : hoveredNow ? "#fde68a" : "#64748b";

        return (
          <mesh
            key={pileCap.pier_index}
            position={pileCap.center}
            onClick={(event) => {
              event.stopPropagation();
              setSelected(makeSelection("pileCap", pileCap.pier_index, `Pile cap ${pileCap.pier_index + 1}`, pileCap));
            }}
            // onPointerOver={(event) => {
            //   event.stopPropagation();
            //   setHovered(makeSelection("pileCap", pileCap.pier_index, `Pile cap ${pileCap.pier_index + 1}`, pileCap));
            // }}
            // onPointerOut={() => setHovered(null)}
          >
            <boxGeometry
              args={[
                pileCap.dimensions.length_x,
                pileCap.dimensions.width_y,
                pileCap.dimensions.thickness_z,
              ]}
            />
            <meshStandardMaterial color={color} transparent opacity={0.22} />
            <Edges color={selectedNow ? "#fbbf24" : "#94a3b8"} />
          </mesh>
        );
      })}
    </group>
  );
}
