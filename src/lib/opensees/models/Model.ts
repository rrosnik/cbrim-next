import * as THREE from "three";

import { IOpenseesModel } from "../types";
import { Element } from "./Element";
import { Node } from "./Node";
import { ElementGeometry } from "../geometry/ElementGeometry";
import { NodeGeometry } from "../geometry/NodeGeometry";

export class OpenseesModel implements IOpenseesModel {
  StructuralAnalysisModel;

  nodeMap: Map<number, Node>;
  elementMap: Map<number, Element>;

  constructor(model: IOpenseesModel) {
    this.StructuralAnalysisModel = model.StructuralAnalysisModel;

    // mode map
    this.nodeMap = new Map(
      this.StructuralAnalysisModel.geometry.nodes.map((node) => [
        node.name,
        new Node(node),
      ]),
    );

    this.elementMap = new Map(
      this.StructuralAnalysisModel.geometry.elements.map((ele) => [
        ele.name,
        new Element(ele, this.nodeMap),
      ]),
    );
  }

  get elements(): Element[] {
    return Array.from(this.elementMap.values());
  }

  get nodes(): Node[] {
    return Array.from(this.nodeMap.values());
  }

  getLines(): THREE.Line[] {
    return this.elements.map((ele) => new ElementGeometry(ele).toLine());
  }

  getMesh(): THREE.Mesh[] {
    return this.nodes.map((ele) =>
      new NodeGeometry(ele).toSphere({
        radius: 0.2,
        material: new THREE.MeshStandardMaterial({ color: "",  }),
      }),
    );
  }
}
