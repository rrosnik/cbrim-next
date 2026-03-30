
import type { BridgeModelExportV2 } from "@/lib/bridge-viewer/types";

export async function fetchBridgeModel(url: string): Promise<BridgeModelExportV2> {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as BridgeModelExportV2;
}
