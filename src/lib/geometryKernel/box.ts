import jscad from "@jscad/modeling";

export const box = (size: number) => {
  const geometry = jscad.primitives.cube({
    size,
    center: [0, 0, 0],
  });

  return jscad.geometries.geom3.toPolygons(geometry);
};
