import { geometries, extrusions, maths } from "@jscad/modeling";
import { Segment3 } from "./Mesh";

type AbutmentParams = {
  width: number;
  supportWidth: number;
  height: number;
  cap_height: number;
  cap_thickness: number;
};

export const standardAbutmentParams: AbutmentParams = {
  width: 1000,
  cap_thickness: 150,
  supportWidth: 100,
  height: 800,
  cap_height: 200,
};

export const createAbutment = (
  params: AbutmentParams = standardAbutmentParams,
) => {
  const scalingFactor = 0.01;
  const w = params.width * scalingFactor;
  const sw = params.supportWidth * scalingFactor;
  const ct = params.cap_thickness * scalingFactor;
  const h = params.height * scalingFactor;
  const ch = params.cap_height * scalingFactor;
  // precalculations
  const w2 = w / 2;

  const centerAdjustment = 0.1;

  const p10 = maths.vec2.fromValues(0 - centerAdjustment, 0);
  const p20 = maths.vec2.fromValues(sw - centerAdjustment, 0);
  const p30 = maths.vec2.fromValues(sw - centerAdjustment, -h);
  const p40 = maths.vec2.fromValues(-ct - centerAdjustment, -h);
  const p50 = maths.vec2.fromValues(-ct - centerAdjustment, ch);
  const p60 = maths.vec2.fromValues(0 - centerAdjustment, ch);

  const crossSection = geometries.geom2.fromPoints([
    p10,
    p20,
    p30,
    p40,
    p50,
    p60,
  ]);

  const abutment = extrusions.extrudeLinear({ height: -w }, crossSection);

  // rotate y 90 degrees
  const xRotation = maths.mat4.create();
  const zRotation = maths.mat4.create();
  const translate = maths.mat4.create();
  maths.mat4.fromXRotation(xRotation, Math.PI / 2);
  maths.mat4.fromZRotation(zRotation, Math.PI / 2);
  maths.mat4.fromTranslation(translate, [w / 2, 0, 0]);

  const rotationMatrix = maths.mat4.create();
  maths.mat4.multiply(rotationMatrix, zRotation, xRotation);
  maths.mat4.multiply(rotationMatrix, translate, rotationMatrix);

  const rotatedAbutment = geometries.geom3.transform(rotationMatrix, abutment);

  const wireframe: Array<Segment3> = [];

  const points = geometries.geom2.toPoints(crossSection);
  for (let i = 0; i < points.length; i++) {
    const prev = points[i];
    const curr = points[(i + 1) % points.length];

    // Bottom cross-section edges (at z=0)
    wireframe.push(
      new Segment3(
        maths.vec3.fromValues(-w2, prev[0], prev[1]),
        maths.vec3.fromValues(-w2, curr[0], curr[1]),
      ),
    );
    // Top cross-section edges (at z=-gl)w
    wireframe.push(
      new Segment3(
        maths.vec3.fromValues(w2, prev[0], prev[1]),
        maths.vec3.fromValues(w2, curr[0], curr[1]),
      ),
    );
    // Vertical edges connecting bottom to top
    wireframe.push(
      new Segment3(
        maths.vec3.fromValues(-w2, prev[0], prev[1]),
        maths.vec3.fromValues(w2, prev[0], prev[1]),
      ),
    );
  }
  return {
    geom3: rotatedAbutment,
    wireframe: wireframe,
  };
};

const standardFootingParams = {
  extraFootingWidth: 150,
  rightWingLength: 800,
  rightWingWidth: 400,
  leftWingLength: 800,
  leftWingWidth: 400,

  frontWingLength: 2000,
  frontWingWidth: 400,
};

const createFooting = (params: {
  extraFootingWidth: number;
  rightWingLength: number;
  rightWingWidth: number;
  leftWingLength: number;
  leftWingWidth: number;
  frontWingLength: number;
  frontWingWidth: number;
  thickness: number;
}) => {
  const scalingFactor = 0.01;
  const few = params.extraFootingWidth * scalingFactor;
  const rwl = params.rightWingLength * scalingFactor;
  const rww = params.rightWingWidth * scalingFactor;

  const lwl = params.leftWingLength * scalingFactor;
  const lww = params.leftWingWidth * scalingFactor;

  const fwl = params.frontWingLength * scalingFactor;
  const fww = params.frontWingWidth * scalingFactor;
  const ft = params.thickness * scalingFactor;

  // precalculations
  const fwl2 = fwl / 2;

  const p10 = maths.vec2.fromValues(-fwl2 - few, -2 * few - lwl);
  const p20 = maths.vec2.fromValues(-fwl2 - few, 0);
  const p30 = maths.vec2.fromValues(fwl2 + few, 0);
  const p40 = maths.vec2.fromValues(fwl2 + few, -2 * few - lwl);
  const p50 = maths.vec2.fromValues(fwl2 - rww - few, -2 * few - lwl);
  const p60 = maths.vec2.fromValues(fwl2 - rww - few, -2 * few - fww);
  const p70 = maths.vec2.fromValues(-fwl2 + rww + few, -2 * few - fww);
  const p80 = maths.vec2.fromValues(-fwl2 + rww + few, -2 * few - lwl);

  const crossSection = geometries.geom2.fromPoints([
    p10,
    p20,
    p30,
    p40,
    p50,
    p60,
    p70,
    p80,
  ]);

  const footing = extrusions.extrudeLinear({ height: -ft }, crossSection);

  const wireframe: Array<Segment3> = [];

  const points = geometries.geom2.toPoints(crossSection);
  for (let i = 0; i < points.length; i++) {
    const prev = points[i];
    const curr = points[(i + 1) % points.length];

    // Bottom cross-section edges (at z=0)
    wireframe.push(
      new Segment3(
        maths.vec3.fromValues(prev[0], prev[1], ft),
        maths.vec3.fromValues(curr[0], curr[1], ft),
      ),
    );
    // Top cross-section edges (at z=-gl)w
    wireframe.push(
      new Segment3(
        maths.vec3.fromValues(prev[0], prev[1], 0),
        maths.vec3.fromValues(curr[0], curr[1], 0),
      ),
    );
    // Vertical edges connecting bottom to top
    wireframe.push(
      new Segment3(
        maths.vec3.fromValues(prev[0], prev[1], 0),
        maths.vec3.fromValues(prev[0], prev[1], ft),
      ),
    );
  }

  return {
    geom3: footing,
    wireframe: wireframe,
  };
};
