import { geometries, maths, extrusions } from "@jscad/modeling";
import { Segment3 } from "./Mesh";

export const createDeck = (params: {
  width: number;
  thickness: number;
  length: number;
  ////////
  parapetHeight: number;
  parapetTopWidth: number;
  parapetBottomWidth: number;
  ///////
  pedesterianPathWidth: number;
  pedesterianPathHeight: number;
}) => {
  // ... deck creation code ...
  const t = params.thickness;
  const w = params.width;
  const l = params.length;

  // parapet
  const ph = params.parapetHeight;
  const ptw = params.parapetTopWidth;
  const pbw = params.parapetBottomWidth;

  // pedesterian path
  const ppw = params.pedesterianPathWidth;
  const pph = params.pedesterianPathHeight;

  ///// pre calculations
  const th = t + pph + ph;
  const w2 = w / 2;
  const w2_ptw = w2 - ptw;
  const w2_pbw = w2 - pbw;
  const w2_pbw_ppw = w2_pbw - ppw;

  const p1 = maths.vec2.fromValues(-w2, 0);
  const p2 = maths.vec2.fromValues(-w2, th);
  const p3 = maths.vec2.fromValues(-w2_ptw, th);
  const p4 = maths.vec2.fromValues(-w2_pbw, t + pph);

  const p5 = maths.vec2.fromValues(-w2_pbw_ppw, t + pph);
  const p6 = maths.vec2.fromValues(-w2_pbw_ppw, t);
  const p7 = maths.vec2.fromValues(-w2_pbw_ppw, t);
  const p8 = maths.vec2.fromValues(w2_pbw_ppw, t);
  const p9 = maths.vec2.fromValues(w2_pbw_ppw, t);
  const p10 = maths.vec2.fromValues(w2_pbw_ppw, t + pph);

  const p11 = maths.vec2.fromValues(w2_pbw, t + pph);
  const p12 = maths.vec2.fromValues(w2_ptw, th);
  const p13 = maths.vec2.fromValues(w2, th);
  const p14 = maths.vec2.fromValues(w2, 0);

  const crossSection = geometries.geom2.fromPoints([
    p1,
    p2,
    p3,
    p4,
    p5,
    p6,
    p7,
    p8,
    p9,
    p10,
    p11,
    p12,
    p13,
    p14,
  ]);

  const scalefactor = 0.01;

  const ScaledCrossSection = geometries.geom2.transform(
    maths.mat4.fromScaling(maths.mat4.create(), [
      scalefactor,
      scalefactor,
      scalefactor,
    ]),
    crossSection
  );

  const deck = extrusions.extrudeLinear(
    { height: -l * scalefactor },
    ScaledCrossSection
  );

  // rotate wireframe and geom3 90 degree around x axis
  const rotationMatrix = maths.mat4.create();
  maths.mat4.fromXRotation(rotationMatrix, (Math.PI / 180) * 90);

  const rotatedDeck = geometries.geom3.transform(rotationMatrix, deck);

  const wireframe: Array<Segment3> = [];

  // Create wireframe edges for the cross-section at both ends and vertical edges
  const points = geometries.geom2.toPoints(ScaledCrossSection);
  for (let i = 0; i < points.length; i++) {
    const prev = points[i];
    const curr = points[(i + 1) % points.length];

    // Bottom cross-section edges
    wireframe.push(
      new Segment3(
        maths.vec3.fromValues(prev[0], prev[1], 0),
        maths.vec3.fromValues(curr[0], curr[1], 0)
      ).applyMatrix4(rotationMatrix)
    );
    // Top cross-section edges
    wireframe.push(
      new Segment3(
        maths.vec3.fromValues(prev[0], prev[1], -l * scalefactor),
        maths.vec3.fromValues(curr[0], curr[1], -l * scalefactor)
      ).applyMatrix4(rotationMatrix)
    );
    // Vertical edges connecting bottom to top
    wireframe.push(
      new Segment3(
        maths.vec3.fromValues(prev[0], prev[1], 0),
        maths.vec3.fromValues(prev[0], prev[1], -l * scalefactor)
      ).applyMatrix4(rotationMatrix)
    );
  }

  return {
    geom3: rotatedDeck,
    wireframe: wireframe,
  };
};

export const standardDeckParams = {
  length: 1500,
  width: 1400 + 300 + 40,
  thickness: 40,
  parapetHeight: 50,
  parapetTopWidth: 25,
  parapetBottomWidth: 30,
  pedesterianPathWidth: 150,
  pedesterianPathHeight: 15,
};
