import type { IElement } from "../types";
import { Node } from "./Node";

export class Element implements IElement {
  A;
  massperlength;
  material;
  name;
  nodes;
  type;
  section;

  nodeObjects: Node[];

  constructor(element: IElement, nodeMap: Map<number, Node>) {
    this.A = element.A;
    this.massperlength = element.massperlength;
    this.material = element.material;
    this.name = element.name;
    this.nodes = element.nodes;
    this.type = element.type;
    this.section = element.section;

    this.nodeObjects = this.nodes.map((nodeName) => {
      const node = nodeMap.get(nodeName);
      if (!node) {
        throw new Error(
          `Element ${this.name}: node "${String(nodeName)}" not found`,
        );
      }
      return node;
    }) as [Node, Node];
  }
}
