import jscad from "@jscad/modeling";
import { Segment3 } from "./Mesh";

const { geometries, extrusions, maths } = jscad;

export const createGirder = (params: {
  length: number;
  height: number;
  cornerBevel: number;
  topFlangeWidth: number;
  topFlangeHeight: number;
  topFlangeChamfer: number;
  bottomFlangeHeight: number;
  bottomFlangeWidth: number;
  bottomFlangeChamfer: number;
  webWidth: number;
  webBevel: number;
}) => {
  // girder
  const gh = params.height; // height
  const gl = params.length; // girder length
  // corner bevel
  const cb = params.cornerBevel; // corner bevel size

  // top flange
  const tfw = params.topFlangeWidth; // top flange width
  const tfh = params.topFlangeHeight; // top flange height
  const tfch = params.topFlangeChamfer; // top flange chamfer

  // bottom flange
  const bfh = params.bottomFlangeHeight; // bottom flange height
  const bfw = params.bottomFlangeWidth; // bottom flange width
  const bfch = params.bottomFlangeChamfer; // bottom flange chamfer

  // web
  const ww = params.webWidth; // web width
  const wb = params.webBevel; // web bevel
  const wh = gh - (tfh + bfh + tfch + bfch + wb); // web height

  // precalculations
  const bfw2 = bfw / 2;
  const bfw2_cb = bfw2 - cb;
  const tfw2 = tfw / 2;
  const tfw2_cb = tfw2 - cb;
  const ww2 = ww / 2;

  // points
  const p1 = maths.vec2.fromValues(-bfw2_cb, 0);
  const p2 = maths.vec2.fromValues(-bfw2, cb);
  const p3 = maths.vec2.fromValues(-bfw2, bfh);
  const p4 = maths.vec2.fromValues(-ww2, bfh + bfch);
  const p5 = maths.vec2.fromValues(-ww2, bfh + bfch + wh);
  const p6 = maths.vec2.fromValues(-ww2 - wb, bfh + bfch + wh + wb);
  const p7 = maths.vec2.fromValues(-tfw2, gh - tfch);
  const p8 = maths.vec2.fromValues(-tfw2, gh - cb);
  const p9 = maths.vec2.fromValues(-tfw2_cb, gh);
  ////////////////////////////////////////////
  const p10 = maths.vec2.fromValues(tfw2_cb, gh);
  const p11 = maths.vec2.fromValues(tfw2, gh - cb);
  const p12 = maths.vec2.fromValues(tfw2, gh - tfch);
  const p13 = maths.vec2.fromValues(ww2 + wb, bfh + bfch + wh + wb);
  const p14 = maths.vec2.fromValues(ww2, bfh + bfch + wh);
  const p15 = maths.vec2.fromValues(ww2, bfh + bfch);
  const p16 = maths.vec2.fromValues(bfw2, bfh);
  const p17 = maths.vec2.fromValues(bfw2, cb);
  const p18 = maths.vec2.fromValues(bfw2_cb, 0);

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
    p15,
    p16,
    p17,
    p18,
  ]);
  // this is cm so make it to meter by scaling 0.01
  const scalingFactor = 0.01;
  const scaleMatrix = maths.mat4.create();
  maths.mat4.fromScaling(scaleMatrix, [
    scalingFactor,
    scalingFactor,
    scalingFactor,
  ]);
  const ScaledCrossSection = geometries.geom2.transform(
    scaleMatrix,
    crossSection
  );

  const girder = extrusions.extrudeLinear(
    { height: -gl * scalingFactor },
    ScaledCrossSection
  );

  const tm = maths.mat4.fromTranslation(
    maths.mat4.create(),
    maths.vec3.fromValues(0, 0, -gh * scalingFactor)
  );
  maths.mat4.rotateX(tm, tm, Math.PI / 2);

  const transformedGirder = geometries.geom3.transform(tm, girder);

  const wireframe: Array<Segment3> = [];

  const points = geometries.geom2.toPoints(ScaledCrossSection);
  for (let i = 0; i < points.length; i++) {
    const prev = points[i];
    const curr = points[(i + 1) % points.length];

    // Bottom cross-section edges (at z=0)
    wireframe.push(
      new Segment3(
        maths.vec3.fromValues(prev[0], prev[1], 0),
        maths.vec3.fromValues(curr[0], curr[1], 0)
      ).applyMatrix4(tm)
    );
    // Top cross-section edges (at z=-gl)
    wireframe.push(
      new Segment3(
        maths.vec3.fromValues(prev[0], prev[1], -gl * scalingFactor),
        maths.vec3.fromValues(curr[0], curr[1], -gl * scalingFactor)
      ).applyMatrix4(tm)
    );
    // Vertical edges connecting bottom to top
    wireframe.push(
      new Segment3(
        maths.vec3.fromValues(prev[0], prev[1], 0),
        maths.vec3.fromValues(prev[0], prev[1], -gl * scalingFactor)
      ).applyMatrix4(tm)
    );
  }
  // add

  return {
    geom3: transformedGirder,
    wireframe: wireframe,
  };
};

export const standardGirderParams = {
  length: 1500,
  height: 184,
  cornerBevel: 2,
  topFlangeWidth: 106,
  topFlangeHeight: 10,
  topFlangeChamfer: 5,
  bottomFlangeHeight: 15,
  bottomFlangeWidth: 66,
  bottomFlangeChamfer: 5,
  webWidth: 15,
  webBevel: 5,
};
