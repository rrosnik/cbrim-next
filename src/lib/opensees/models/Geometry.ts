import type { IGeometry } from "../types";

export class Geometry implements IGeometry {
  constraints;
  elements;
  nodes;

  constructor(geometry: IGeometry) {
    this.constraints = geometry.constraints;
    this.elements = geometry.elements;
    this.nodes = geometry.nodes;
  }
}
