import * as THREE from "three";
import { Node } from "../models/Node";

export class NodeGeometry {
  constructor(public node: Node) {}

  toBufferGeometry(): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(this.node.toPositionArray(), 3),
    );
    return geometry;
  }

  toPoint(
    material: THREE.PointsMaterial = new THREE.PointsMaterial({ size: 0.15 }),
  ): THREE.Points {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(this.node.toPositionArray(), 3),
    );
    return new THREE.Points(geometry, material);
  }

  toSphere({
    radius = 0.08,
    material = new THREE.MeshStandardMaterial(),
  }: {
    radius: number;
    material: THREE.MeshStandardMaterial;
  }) {
    const geometry = new THREE.SphereGeometry(radius, 12, 12);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(this.node.toVector3());
    return mesh;
  }
}
