import jscad from "@jscad/modeling";

const { booleans, transforms, extrusions, maths } = jscad;

type PierParams = {
  width: number;
  length: number;
  height: number;
  width_chamfer: number;
  length_chamfer: number;
  /* intrusion part */
  intrusion_width: number;
  intrusion_length: number;

  // cap
  cap_length: number;
  cap_height: number;
  cap_top_height: number;
};

export const standardPierParams: PierParams = {
  width: 3,
  length: 5,
  height: 12,
  width_chamfer: 1,
  length_chamfer: 1,
  /* intrusion part */
  intrusion_width: 0.2,
  intrusion_length: 2,

  cap_height: 7,
  cap_length: 22,
  cap_top_height: 2,
};

export const createPier = (options: PierParams) => {
  const pw = options.width; // pier width
  const pl = options.length; // pier length
  const ph = options.height; // pier height
  const pwi = options.width_chamfer; // pier width chamfer
  const pli = options.length_chamfer; // pier length chamfer
  const eph = pwi; // extended pier height

  // cap
  const cl = options.cap_length; // cap length
  const ch = options.cap_height; // cap height
  // const cw = pw; // cap width same as pier width
  const cli = pli; // cap length chamfer same as pier length chamfer
  const cth = options?.cap_top_height; // cap top height

  const pureCl = (cl - pl) / 2; // pure one side cap length
  const cs = (ch - eph) / (pureCl + pli); // cap slope

  // const y = pwi * cs; // cap y offset due to pier chamfer
  const yy = (pureCl - cli) * cs; // cap y offset due to cap chamfer

  // intrusion part
  const iw = options.intrusion_width ?? 0.2;
  const il = options.intrusion_length ?? 3;
  const ih = ph + eph;

  // precalculations
  const pw2 = pw / 2;
  const pl2 = pl / 2;
  const pl2_pli = pl2 - pli;
  const cl2 = cl / 2;
  const pw2_pwi = pw2 - pwi;
  const cl2_cli = cl2 - cli;
  // 1. first slice

  const s1p1 = maths.vec3.fromValues(-pl2_pli, -pw2, 0);
  const s1p2 = maths.vec3.fromValues(-pl2_pli, -pw2, ph);
  const s1p3 = maths.vec3.fromValues(-pl2_pli, -pw2, ph + eph);
  const s1p4 = maths.vec3.fromValues(-cl2, -pw2, ph + ch);
  const s1p5 = maths.vec3.fromValues(-cl2, -pw2, ph + ch);
  const s1p6 = maths.vec3.fromValues(-cl2_cli, -pw2, ph + ch + cth);
  // ///////////////////
  const s1p7 = maths.vec3.fromValues(cl2_cli, -pw2, ph + ch + cth);
  const s1p8 = maths.vec3.fromValues(cl2, -pw2, ph + ch);
  const s1p9 = maths.vec3.fromValues(cl2, -pw2, ph + ch);
  const s1p10 = maths.vec3.fromValues(pl2_pli, -pw2, ph + eph);
  const s1p11 = maths.vec3.fromValues(pl2_pli, -pw2, ph);
  const s1p12 = maths.vec3.fromValues(pl2_pli, -pw2, 0);

  const firstSlice = extrusions.slice.fromPoints([
    s1p1,
    s1p2,
    s1p3,
    s1p4,
    s1p5,
    // s1p6,
    // ///////////////////
    // s1p7,
    s1p8,
    s1p9,
    s1p10,
    s1p11,
    s1p12,
  ]);

  const s2p1 = maths.vec3.fromValues(-pl2, -pw2_pwi, 0);
  const s2p2 = maths.vec3.fromValues(-pl2, -pw2_pwi, ph);
  const s2p3 = maths.vec3.fromValues(-pl2, -pw2_pwi, ph);
  const s2p4 = maths.vec3.fromValues(-cl2_cli, -pw2_pwi, ph + yy);
  const s2p5 = maths.vec3.fromValues(-cl2, -pw2_pwi, ph + ch);
  const s2p6 = maths.vec3.fromValues(-cl2_cli, -pw2_pwi, ph + ch + cth);
  // //////////////////////////////////////////////////////////
  const s2p7 = maths.vec3.fromValues(cl2_cli, -pw2_pwi, ph + ch + cth);
  const s2p8 = maths.vec3.fromValues(cl2, -pw2_pwi, ph + ch);
  const s2p9 = maths.vec3.fromValues(cl2_cli, -pw2_pwi, ph + yy);
  const s2p10 = maths.vec3.fromValues(pl2, -pw2_pwi, ph);
  const s2p11 = maths.vec3.fromValues(pl2, -pw2_pwi, ph);
  const s2p12 = maths.vec3.fromValues(pl2, -pw2_pwi, 0);

  const secondSlice = extrusions.slice.fromPoints([
    s2p1,
    s2p2,
    s2p3,
    s2p4,
    s2p5,
    // s2p6,
    // //////////////////////////////////////////////////////////
    // s2p7,
    s2p8,
    s2p9,
    s2p10,
    s2p11,
    s2p12,
  ]);

  const s3p1 = maths.vec3.fromValues(-pl2, pw2_pwi, 0);
  const s3p2 = maths.vec3.fromValues(-pl2, pw2_pwi, ph);
  const s3p3 = maths.vec3.fromValues(-pl2, pw2_pwi, ph);
  const s3p4 = maths.vec3.fromValues(-cl2_cli, pw2_pwi, ph + yy);
  const s3p5 = maths.vec3.fromValues(-cl2, pw2_pwi, ph + ch);
  const s3p6 = maths.vec3.fromValues(-cl2_cli, pw2_pwi, ph + ch + cth);
  // ///////////////////
  const s3p7 = maths.vec3.fromValues(cl2_cli, pw2_pwi, ph + ch + cth);
  const s3p8 = maths.vec3.fromValues(cl2, pw2_pwi, ph + ch);
  const s3p9 = maths.vec3.fromValues(cl2_cli, pw2_pwi, ph + yy);
  const s3p10 = maths.vec3.fromValues(pl2, pw2_pwi, ph);
  const s3p11 = maths.vec3.fromValues(pl2, pw2_pwi, ph);
  const s3p12 = maths.vec3.fromValues(pl2, pw2_pwi, 0);
  const thirdSlice = extrusions.slice.fromPoints([
    s3p1,
    s3p2,
    s3p3,
    s3p4,
    s3p5,
    // s3p6,
    // ///////////////////
    // s3p7,
    s3p8,
    s3p9,
    s3p10,
    s3p11,
    s3p12,
  ]);

  const s4p1 = maths.vec3.fromValues(-pl2_pli, pw2, 0);
  const s4p2 = maths.vec3.fromValues(-pl2_pli, pw2, ph);
  const s4p3 = maths.vec3.fromValues(-pl2_pli, pw2, ph + eph);
  const s4p4 = maths.vec3.fromValues(-cl2, pw2, ph + ch);
  const s4p5 = maths.vec3.fromValues(-cl2, pw2, ph + ch);
  const s4p6 = maths.vec3.fromValues(-cl2_cli, pw2, ph + ch + cth);
  // ///////////////////
  const s4p7 = maths.vec3.fromValues(cl2_cli, pw2, ph + ch + cth);
  const s4p8 = maths.vec3.fromValues(cl2, pw2, ph + ch);
  const s4p9 = maths.vec3.fromValues(cl2, pw2, ph + ch);
  const s4p10 = maths.vec3.fromValues(pl2_pli, pw2, ph + eph);
  const s4p11 = maths.vec3.fromValues(pl2_pli, pw2, ph);
  const s4p12 = maths.vec3.fromValues(pl2_pli, pw2, 0);

  const fourthSlice = extrusions.slice.fromPoints([
    s4p1,
    s4p2,
    s4p3,
    s4p4,
    s4p5,
    // s4p6,
    // ///////////////////
    // s4p7,
    s4p8,
    s4p9,
    s4p10,
    s4p11,
    s4p12,
  ]);

  let pier = extrusions.extrudeFromSlices(
    {
      numberOfSlices: 4,
      callback: (t) => {
        if (t < 0.25) {
          return firstSlice;
        } else if (t < 0.5) {
          return secondSlice;
        } else if (t < 0.75) {
          return thirdSlice;
        } else {
          return fourthSlice;
        }
      },
    },
    extrusions.slice.toPolygons(firstSlice)
  );

  const il2 = il / 2;
  const il2_iw = il2 - iw;
  const pw2_iw = pw2 - iw;
  const ih_iw = ih - iw;

  const intrusionOutsideSlice = extrusions.slice.fromPoints([
    [-il2, -pw2, 0],
    [-il2, -pw2, ih],
    [il2, -pw2, ih],
    [il2, -pw2, 0],
  ]);
  const intrusionInsideSlice2 = extrusions.slice.fromPoints([
    [-il2_iw, -pw2_iw, 0],
    [-il2_iw, -pw2_iw, ih_iw],
    [il2_iw, -pw2_iw, ih_iw],
    [il2_iw, -pw2_iw, 0],
  ]);

  const intrusion = extrusions.extrudeFromSlices(
    {
      numberOfSlices: 2,
      callback: (t) => {
        if (t < 0.5) {
          return intrusionOutsideSlice;
        } else {
          return intrusionInsideSlice2;
        }
      },
    },
    extrusions.slice.toPolygons(intrusionOutsideSlice)
  );
  const intrusion2 = transforms.rotateZ(Math.PI, intrusion);

  pier = booleans.subtract(pier, intrusion, intrusion2);

  // cap top

  return {
    geom3: pier,
    wireframe: undefined,
  };
};
