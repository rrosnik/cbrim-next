import { geometries, maths } from "@jscad/modeling";
import { polygonsToMesh } from "./utils";

export class Segment3 {
  a: maths.vec3.Vec3;
  b: maths.vec3.Vec3;
  constructor(a: maths.vec3.Vec3, b: maths.vec3.Vec3) {
    this.a = a;
    this.b = b;
  }

  applyMatrix4(matrix: maths.mat4.Mat4): this {
    this.a = maths.vec3.transform(maths.vec3.create(), this.a, matrix);
    this.b = maths.vec3.transform(maths.vec3.create(), this.b, matrix);
    return this;
  }
}

export class Mesh {
  protected geom3: geometries.geom3.Geom3;
  /////
  protected mesh!: number[];
  protected wireframe?: Segment3[];
  protected polygons!: geometries.poly3.Poly3[];

  constructor(geom3: geometries.geom3.Geom3, wireframe?: Segment3[]) {
    this.geom3 = geom3;
    this.wireframe = wireframe;
  }

  toPolygons(): Array<geometries.poly3.Poly3> {
    if (this.polygons) return this.polygons;
    this.polygons = geometries.geom3.toPolygons(this.geom3);
    return this.polygons;
  }

  toWireframe(): Array<Segment3> {
    if (this.wireframe) return this.wireframe;
    const segments: Array<Segment3> = [];
    const polygons = this.toPolygons();
    polygons.forEach((p) => {
      const vertices = p.vertices;
      for (let i = 0; i < vertices.length; i++) {
        const v1 = vertices[i];
        const v2 = vertices[(i + 1) % vertices.length];
        segments.push(new Segment3(v1, v2));
      }
    });
    this.wireframe = segments;
    return this.wireframe;
  }

  toMesh(): number[] {
    if (this.mesh) return this.mesh;
    this.mesh = polygonsToMesh(this.toPolygons());
    return this.mesh;
  }

  applyMatrix4(matrix: maths.mat4.Mat4): this {
    this.geom3 = geometries.geom3.transform(matrix, this.geom3);

    if (this.wireframe) {
      this.wireframe.forEach((segment) => {
        segment.applyMatrix4(matrix);
      });
    }

    return this;
  }
}
