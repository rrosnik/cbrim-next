
import { create } from "zustand";

import type { BridgeModelExportV2, LayerVisibility, ResultMode, ViewerDisplayMode, ViewerSelection } from "@/lib/bridge-viewer/types";

type BridgeViewerState = {
  visibility: LayerVisibility;
  groupVisibility: Record<string, boolean>;
  selectedLoadCases: string[];
  displayMode: ViewerDisplayMode;
  resultMode: ResultMode;
  deformationScale: number | null;
  showNodalLoads: boolean;
  showSurfaceLoads: boolean;
  selected: ViewerSelection | null;
  hovered: ViewerSelection | null;
  treeSearch: string;

  initializeFromData: (data: BridgeModelExportV2) => void;
  setLayerVisibility: <K extends keyof LayerVisibility>(key: K, value: boolean) => void;
  toggleGroupVisibility: (groupName: string) => void;
  toggleLoadCase: (loadCase: string) => void;
  setDisplayMode: (value: ViewerDisplayMode) => void;
  setResultMode: (value: ResultMode) => void;
  setDeformationScale: (value: number | null) => void;
  setShowNodalLoads: (value: boolean) => void;
  setShowSurfaceLoads: (value: boolean) => void;
  setSelected: (value: ViewerSelection | null) => void;
  setHovered: (value: ViewerSelection | null) => void;
  setTreeSearch: (value: string) => void;
};

const defaultVisibility: LayerVisibility = {
  nodes: false,
  elements: true,
  shells: false,
  loads: false,
  supports: false,
  bearings: false,
  pileCaps: false,
  rigidLinks: false,
};

export const useBridgeViewerStore = create<BridgeViewerState>((set) => ({
  visibility: defaultVisibility,
  groupVisibility: {},
  selectedLoadCases: [],
  displayMode: "undeformed",
  resultMode: "none",
  deformationScale: null,
  showNodalLoads: false,
  showSurfaceLoads: false,
  selected: null,
  hovered: null,
  treeSearch: "",

  initializeFromData: (data) =>
    set(() => ({
      groupVisibility: Object.fromEntries(Object.keys(data.groups).map((groupName) => [groupName, false])),
      // selectedLoadCases: data.loads.patterns.map((pattern) => pattern.name),
      deformationScale: data.scene.deformed_plot_scale,
      selected: null,
      hovered: null,
    })),

  setLayerVisibility: (key, value) =>
    set((state) => ({
      visibility: {
        ...state.visibility,
        [key]: value,
      },
    })),

  toggleGroupVisibility: (groupName) =>
    set((state) => ({
      groupVisibility: {
        ...state.groupVisibility,
        [groupName]: !state.groupVisibility[groupName],
      },
    })),

  toggleLoadCase: (loadCase) =>
    set((state) => {
      const has = state.selectedLoadCases.includes(loadCase);
      return {
        selectedLoadCases: has
          ? state.selectedLoadCases.filter((item) => item !== loadCase)
          : [...state.selectedLoadCases, loadCase],
      };
    }),

  setDisplayMode: (value) => set(() => ({ displayMode: value })),
  setResultMode: (value) => set(() => ({ resultMode: value })),
  setDeformationScale: (value) => set(() => ({ deformationScale: value })),
  setShowNodalLoads: (value) => set(() => ({ showNodalLoads: value })),
  setShowSurfaceLoads: (value) => set(() => ({ showSurfaceLoads: value })),
  setSelected: (value) => set(() => ({ selected: value })),
  setHovered: (value) => set(() => ({ hovered: value })),
  setTreeSearch: (value) => set(() => ({ treeSearch: value })),
}));
