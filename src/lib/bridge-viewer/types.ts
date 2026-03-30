
export type ViewerDisplayMode = "undeformed" | "deformed" | "both";
export type ResultMode = "none" | "displacement" | "elementForce" | "reaction";

export type LayerVisibility = {
  nodes: boolean;
  elements: boolean;
  shells: boolean;
  loads: boolean;
  supports: boolean;
  bearings: boolean;
  pileCaps: boolean;
  rigidLinks: boolean;
};

export type ViewerSelectionKind =
  | "node"
  | "element"
  | "load"
  | "support"
  | "bearing"
  | "pileCap"
  | "rigidLink"
  | "component"
  | "group";

export type ViewerSelection = {
  kind: ViewerSelectionKind;
  id: string | number;
  label: string;
  payload: unknown;
};

export type Vec3 = [number, number, number];
export type Vec6 = [number, number, number, number, number, number];

export type BridgeNode = {
  tag: number;
  coords: Vec3;
  disp: Vec6;
  disp_translation: Vec3;
  disp_rotation: Vec3;
  disp_magnitude: number;
  deformed_coords: Vec3;
  reaction: Vec6 | null;
  reaction_magnitude: number | null;
  mass: Vec6 | null;
  fixity: number[] | null;
  groups: string[];
  roles: string[];
};

export type BridgeElement = {
  tag: number;
  type: string;
  group: string | null;
  connectivity: number[];
  centroid: Vec3 | null;
  length: number | null;
  local_axes: {
    x_local: Vec3;
    y_local: Vec3;
    z_local: Vec3;
  } | null;
  forces: number[] | null;
  force_summary: {
    num_values: number;
    max_abs: number;
    min: number;
    max: number;
  } | null;
  metadata: Record<string, unknown>;
  render: {
    render_type: "line" | "quad" | "link";
    section_key: string;
    section?: unknown;
    metadata?: unknown;
  };
};

export type LoadPattern = {
  name: string;
  pattern_tag: number;
  time_series_tag: number;
  node_loads: Array<{ node: number; load: number[] }>;
  total_load: number[];
  display_arrows: Array<{
    node: number;
    start: Vec3;
    vector: Vec3;
    magnitude: number;
    direction: Vec3;
    display_end: Vec3;
  }>;
};

export type SurfaceLoad = {
  pattern: string;
  target_group: string;
  element: number;
  nodes: number[];
  pressure: number;
  direction: Vec3;
};

export type BridgeModelExportV2 = {
  schema: string;
  analysis: {
    analysis_return_code: number | null;
    analysis_status: string;
    description: string;
    convention: string;
  };
  units: Record<string, string>;
  params: {
    total_length?: number;
    span_lengths: number[];
    bridge_width: number;
    deck_thickness: number;
    deformed_shape_scale: number;
    [key: string]: unknown;
  };
  geometry: {
    support_xs: number[];
    pier_xs: number[];
    deck_xs: number[];
    girder_ys: number[];
    shell_ys: number[];
    z: Record<string, number>;
    sections: Record<string, unknown>;
    [key: string]: unknown;
  };
  global_bbox: {
    min: Vec3;
    max: Vec3;
    size: Vec3;
    center: Vec3;
    diagonal: number;
  };
  section_library: Record<string, unknown>;
  components: {
    spans: Array<{ index: number; length: number; x_start: number; x_end: number; support_left_x: number; support_right_x: number }>;
    support_lines: Array<{ index: number; x: number; kind: string; bearings: Array<number | undefined> }>;
    girder_lines: Array<{ index: number; y: number; nodes: number[] }>;
    piers: Array<{ index: number; x: number; column: unknown; pile_cap_ref: number; piles: unknown[] }>;
    abutments: Array<{ index: number; x: number; nodes: number[] }>;
    pile_groups: Array<{ pier_index: number; pile_cap_ref: number; piles: Array<{ index: number; head: number; tip: number }> }>;
  };
  groups: Record<string, number[]>;
  nodes: BridgeNode[];
  elements: BridgeElement[];
  constraints: {
    fixities: Array<{ node: number; fixity: number[] }>;
    rigid_links: Array<{ type: string; retained: number; constrained: number }>;
  };
  masses: {
    by_node: Array<{ node: number; mass: number[] }>;
  };
  loads: {
    patterns: LoadPattern[];
    total_by_node: Array<{ node: number; load: number[] }>;
    surface_loads: SurfaceLoad[];
    display: {
      suggested_arrow_scale: number;
      max_nodal_force: number;
    };
  };
  bearings: Array<{
    support_index: number;
    girder_index: number;
    element: number;
    bottom_node: number;
    top_node: number;
    bottom_coords: Vec3;
    top_coords: Vec3;
    height: number;
    relative_disp: number[];
    relative_translation: Vec3;
    stiffness: Record<string, number>;
    compression_only_vertical: boolean;
    render: unknown;
  }>;
  scene: {
    deformed_plot_scale: number;
    bbox: {
      min: Vec3;
      max: Vec3;
      size: Vec3;
      center: Vec3;
      diagonal: number;
    };
    lines: Record<string, Array<{
      element_tag: number;
      group: string;
      nodes: number[];
      undeformed: Vec3[];
      deformed: Vec3[];
      plot_deformed: Vec3[];
      local_axes: { x_local: Vec3; y_local: Vec3; z_local: Vec3 };
    }>>;
    shells: Record<string, Array<{
      element_tag: number;
      nodes: number[];
      undeformed: Vec3[];
      deformed: Vec3[];
      plot_deformed: Vec3[];
    }>>;
    solids: {
      pile_caps: Array<{
        pier_index: number;
        node: number;
        shape: "box";
        center: Vec3;
        dimensions: { length_x: number; width_y: number; thickness_z: number };
        corners: { min: Vec3; max: Vec3 };
      }>;
    };
    supports: Array<{
      node: number;
      coords: Vec3;
      fixity: number[];
      restrained_dofs: number[];
      kind: string;
    }>;
    load_arrows: Array<{
      node: number;
      start: Vec3;
      vector: Vec3;
      magnitude: number;
      direction: Vec3;
      display_end: Vec3;
    }>;
    rigid_links: Array<{ type: string; retained: number; constrained: number }>;
  };
  named_nodes: Record<string, unknown>;
  model_metadata: {
    element_types: Record<string, string>;
    element_metadata: Record<string, unknown>;
    node_groups: Record<string, string[]>;
  };
};
