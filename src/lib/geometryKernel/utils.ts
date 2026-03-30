import jscad from "@jscad/modeling";
import earcut from "earcut";

export const calcNormal = (
  v1: number[],
  v2: number[],
  v3: number[],
): number[] => {
  const edge1: number[] = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];

  const edge2: number[] = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];

  const normal: number[] = [
    edge1[1] * edge2[2] - edge1[2] * edge2[1],
    edge1[2] * edge2[0] - edge1[0] * edge2[2],
    edge1[0] * edge2[1] - edge1[1] * edge2[0],
  ];
  const length = Math.sqrt(
    normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2],
  );

  return [normal[0] / length, normal[1] / length, normal[2] / length];
};

export const polygonsToMesh = (
  polygon: jscad.geometries.geom3.Geom3["polygons"],
) => {
  const positions: number[] = [];

  polygon.forEach((poly) => {
    if (!poly.vertices) throw new Error("Polygon has no vertices");
    let normal: number[] = [0, 0, 0];
    switch (poly.vertices.length) {
      case 3:
        normal = calcNormal(
          poly.vertices[0],
          poly.vertices[1],
          poly.vertices[2],
        );
        poly.vertices.forEach((vertex) => {
          positions.push(
            vertex[0],
            vertex[1],
            vertex[2],
            normal[0],
            normal[1],
            normal[2],
          );
        });
        break;
      case 4:
        normal = calcNormal(
          poly.vertices[0],
          poly.vertices[1],
          poly.vertices[2],
        );
        // Split quad into two triangles
        positions.push(
          poly.vertices[0][0],
          poly.vertices[0][1],
          poly.vertices[0][2],
          normal[0],
          normal[1],
          normal[2],
          poly.vertices[1][0],
          poly.vertices[1][1],
          poly.vertices[1][2],
          normal[0],
          normal[1],
          normal[2],
          poly.vertices[2][0],
          poly.vertices[2][1],
          poly.vertices[2][2],
          normal[0],
          normal[1],
          normal[2],
        );

        positions.push(
          poly.vertices[0][0],
          poly.vertices[0][1],
          poly.vertices[0][2],
          normal[0],
          normal[1],
          normal[2],
          poly.vertices[2][0],
          poly.vertices[2][1],
          poly.vertices[2][2],
          normal[0],
          normal[1],
          normal[2],
          poly.vertices[3][0],
          poly.vertices[3][1],
          poly.vertices[3][2],
          normal[0],
          normal[1],
          normal[2],
        );
        break;
      default: {
        // Use earcut to triangulate polygon with more than 4 vertices
        const triangles = earcut(poly.vertices.flatMap((v) => [v[0], v[1]]));
        for (let i = 0; i < triangles.length; i += 3) {
          const v1 = poly.vertices[triangles[i]];
          const v2 = poly.vertices[triangles[i + 1]];
          const v3 = poly.vertices[triangles[i + 2]];
          normal = calcNormal(v1, v2, v3);
          [v1, v2, v3].forEach((vertex) => {
            positions.push(
              vertex[0],
              vertex[1],
              vertex[2],
              normal[0],
              normal[1],
              normal[2],
            );
          });
        }
        break;
      }
    }
  });
  return positions;
};
