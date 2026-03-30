import type { INode } from "../types";
import * as THREE from "three";

export class Node implements INode {
  name;
  ndf;
  crd;
  constructor(node: INode) {
    this.name = node.name;
    this.ndf = node.ndf;
    this.crd = node.crd;
  }

  toVector3(): THREE.Vector3 {
    const [x = 0, y = 0, z = 0] = this.crd;
    return new THREE.Vector3(x, y, z);
  }

  toPositionArray(): [number, number, number] {
    const [x = 0, y = 0, z = 0] = this.crd;
    return [x, y, z];
  }
}
