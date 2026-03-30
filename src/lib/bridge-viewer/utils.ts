
import type { BridgeElement, BridgeModelExportV2, BridgeNode, ResultMode } from "@/lib/bridge-viewer/types";

export const paletteStops = ["#1d4ed8", "#06b6d4", "#22c55e", "#eab308", "#f97316", "#dc2626"];

export function prettyNumber(value: number, digits = 3): string {
  return Number.isFinite(value) ? value.toFixed(digits) : "0";
}

export function getEffectiveDeformationScale(data: BridgeModelExportV2, override: number | null): number {
  return override ?? data.scene.deformed_plot_scale ?? data.params.deformed_shape_scale ?? 1;
}

export function groupBaseColor(groupName: string): string {
  switch (groupName) {
    case "girder":
      return "#10b981";
    case "deck_shell":
      return "#38bdf8";
    case "cap_beam":
      return "#22c55e";
    case "abutment_beam":
      return "#34d399";
    case "column":
      return "#a78bfa";
    case "pile":
      return "#8b5cf6";
    case "bearing":
      return "#f59e0b";
    default:
      return "#94a3b8";
  }
}

export function loadCaseColor(name: string): string {
  const key = name.toLowerCase();
  if (key.includes("live")) return "#ef4444";
  if (key.includes("super")) return "#f59e0b";
  if (key.includes("dead")) return "#38bdf8";
  return "#e879f9";
}

export function colorFromNormalized(value: number): string {
  const t = Math.max(0, Math.min(1, value));
  const hue = 220 - 220 * t;
  return `hsl(${hue} 85% 55%)`;
}

export function buildNodeMap(data: BridgeModelExportV2): Map<number, BridgeNode> {
  return new Map(data.nodes.map((node) => [node.tag, node]));
}

export function buildElementMap(data: BridgeModelExportV2): Map<number, BridgeElement> {
  return new Map(data.elements.map((element) => [element.tag, element]));
}

export function averagePoints(points: number[][]): [number, number, number] {
  const sum = points.reduce(
    (acc, point) => [acc[0] + point[0], acc[1] + point[1], acc[2] + point[2]],
    [0, 0, 0] as [number, number, number],
  );
  return [sum[0] / points.length, sum[1] / points.length, sum[2] / points.length];
}

export function getNodeResultValue(node: BridgeNode, resultMode: ResultMode): number {
  if (resultMode === "displacement") return node.disp_magnitude;
  if (resultMode === "reaction") return node.reaction_magnitude ?? 0;
  return 0;
}

export function getElementResultValue(element: BridgeElement, resultMode: ResultMode): number {
  if (resultMode === "elementForce") return element.force_summary?.max_abs ?? 0;
  return 0;
}

export function getShellResultValue(nodeIds: number[], nodeMap: Map<number, BridgeNode>, resultMode: ResultMode): number {
  if (resultMode !== "displacement") return 0;
  const values = nodeIds
    .map((id) => nodeMap.get(id)?.disp_magnitude ?? 0)
    .filter((value) => Number.isFinite(value));
  if (!values.length) return 0;
  return values.reduce((acc, value) => acc + value, 0) / values.length;
}

export function getResultExtrema(data: BridgeModelExportV2, resultMode: ResultMode): { maxValue: number } {
  if (resultMode === "displacement") {
    return { maxValue: Math.max(...data.nodes.map((node) => node.disp_magnitude), 1) };
  }
  if (resultMode === "reaction") {
    return { maxValue: Math.max(...data.nodes.map((node) => node.reaction_magnitude ?? 0), 1) };
  }
  if (resultMode === "elementForce") {
    return { maxValue: Math.max(...data.elements.map((element) => element.force_summary?.max_abs ?? 0), 1) };
  }
  return { maxValue: 1 };
}

export function isSelected(selectionId: string | number, selectedId: string | number | null | undefined): boolean {
  return selectedId !== undefined && selectedId !== null && selectionId === selectedId;
}
