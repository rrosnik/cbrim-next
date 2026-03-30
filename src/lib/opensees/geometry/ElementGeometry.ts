import { Element } from "../models/Element";
import * as THREE from "three";

export class ElementGeometry {
  constructor(public element: Element) {}

  toLineBufferGeometry(): THREE.BufferGeometry {
    const positions = this.element.nodeObjects.map((node) => node.toVector3());

    if (positions.length < 2) {
      throw new Error(
        `Element ${this.element.name}: at least 2 nodes are required to create line geometry`,
      );
    }

    const flat: number[] = [];
    for (const p of positions) {
      flat.push(p.x, p.y, p.z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(flat, 3),
    );

    return geometry;
  }

  toLine(
    {
      material,
    }: {
      material: THREE.LineBasicMaterial;
    } = { material: new THREE.LineBasicMaterial() },
  ): THREE.Line {
    const geometry = this.toLineBufferGeometry();
    return new THREE.Line(geometry, material);
  }
}
