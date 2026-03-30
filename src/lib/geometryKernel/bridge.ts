import type { Segment3 } from "./Mesh";
import { createDeck, standardDeckParams } from "./deck";
import { createGirder, standardGirderParams } from "./girder";
import { maths, geometries } from "@jscad/modeling";
import { createPier, standardPierParams } from "./pier";
import { createAbutment, standardAbutmentParams } from "./abutments";
import { createPile, standardPileParams } from "./pile";

type BridgeParams = {
  bridgeLength: number;
  spanCount: number;
  deckWidth: number;
  deckThickness: number;
  girderCount: number;

  // joints, supports, etc. can be added later
  expansionJoint: boolean;
  expansionJointWidth: number;

  // pedesterian
  pedestrianWidth: number;
};

export const standardBridgeParams: BridgeParams = {
  bridgeLength: 10000,
  spanCount: 4,
  deckWidth: 2000,
  deckThickness: 40,
  girderCount: 4,

  //
  expansionJoint: true,
  expansionJointWidth: 20,

  pedestrianWidth: 150,
};

export const createBridge = (params: BridgeParams = standardBridgeParams) => {
  const deck = createDeck({
    ...standardDeckParams,
    length: params.bridgeLength,
    width: params.deckWidth,
    ...(params.pedestrianWidth && {
      pedesterianPathWidth: params.pedestrianWidth,
    }),
  });

  const girders = createGirders({
    bridgeLength: params.bridgeLength,
    girderCount: params.girderCount,
    deckWidth: params.deckWidth,
  });

  const piers = createPiers({
    spanCount: params.spanCount,
    bridgeLength: params.bridgeLength,
    deckWidth: params.deckWidth,
    deckThickness: params.deckThickness,
    girderHeight: standardGirderParams.height,
    pierheight: 800,
    cap_height: 300,
  });

  const abutments = createAbutments({
    bridgeLength: params.bridgeLength,
    deckWidth: params.deckWidth,
    deckThickness: params.deckThickness,
    girderHeight: standardGirderParams.height,
  });

  const piles = createPiles({
    bridgeLength: params.bridgeLength,
    pileDiameter: 50,
    pileCapWidth: 600,
    pileCapLength: 1500,
    deckThickness: params.deckThickness,
    girderHeight: standardGirderParams.height,
    pierHeight: 1000 + 300,
    rows: 4,
    columns: 3,
    spanCount: params.spanCount,
  });

  return {
    girders: girders,
    deck: deck,
    piers: piers,
    abutments: abutments,
    piles: piles,
  };
};

const createGirders = (params: {
  bridgeLength: number;
  girderCount: number;
  deckWidth: number;
}) => {
  const results: {
    geom3: geometries.geom3.Geom3;
    wireframe?: Array<Segment3>;
  }[] = [];
  const scaleFactor = 0.01;
  const girderLocations = Array.from({ length: params.girderCount }, (_, i) => {
    return (
      (-params.deckWidth * scaleFactor) / 2 +
      (i + 0.5) * ((params.deckWidth * scaleFactor) / params.girderCount)
    );
  });

  for (let i = 0; i < params.girderCount; i++) {
    const girder = createGirder({
      ...standardGirderParams,
      length: params.bridgeLength,
    });
    const tm = maths.mat4.fromTranslation(
      maths.mat4.create(),

      maths.vec3.fromValues(girderLocations[i], 0, 0)
    );
    const transformedGirder = geometries.geom3.transform(tm, girder.geom3);
    girder.wireframe?.forEach((segment) => segment.applyMatrix4(tm));
    results.push({
      geom3: transformedGirder,
      wireframe: girder.wireframe,
    });
  }
  return results;
};

const createPiers = (params: {
  bridgeLength: number;
  spanCount: number;
  deckWidth: number;
  deckThickness: number;
  girderHeight: number;
  pierheight: number;
  cap_height: number;
}) => {
  const results: {
    geom3: geometries.geom3.Geom3;
    wireframe?: Array<Segment3>;
  }[] = [];
  const scaleFactor = 0.01;
  const pierLocations = Array.from({ length: params.spanCount - 1 }, (_, i) => {
    return ((i + 1) * params.bridgeLength * scaleFactor) / params.spanCount;
  });

  pierLocations.forEach((location) => {
    // create pier geometry here
    const pier = createPier({
      ...standardPierParams,
      cap_length: params.deckWidth * scaleFactor,
      height: params.pierheight * scaleFactor,
      cap_height: params.cap_height * scaleFactor,
    });

    const tm = maths.mat4.fromTranslation(
      maths.mat4.create(),
      maths.vec3.fromValues(
        0,
        location,
        -params.pierheight * scaleFactor -
          params.cap_height * scaleFactor -
          params.deckThickness * scaleFactor -
          params.girderHeight * scaleFactor
      )
    );
    const transformedPier = geometries.geom3.transform(tm, pier.geom3);
    // pier.wireframe?.forEach((segment) => segment.applyMatrix4(tm));
    results.push({
      geom3: transformedPier,
      wireframe: undefined,
    });
  });

  return results;
};

const createAbutments = (params: {
  bridgeLength: number;
  deckWidth: number;
  deckThickness: number;
  girderHeight: number;
}) => {
  const scalingFactor = 0.01;
  // placeholder for abutments
  const startAbutment = createAbutment({
    ...standardAbutmentParams,
    width: params.deckWidth,
  });

  const _endAbutment = createAbutment({
    ...standardAbutmentParams,
    width: params.deckWidth,
  });

  const transformZ = maths.mat4.fromTranslation(
    maths.mat4.create(),
    maths.vec3.fromValues(
      0,
      0,
      -params.deckThickness * scalingFactor -
        params.girderHeight * scalingFactor
    )
  );
  const startAbutmentTransformed = geometries.geom3.transform(
    transformZ,
    startAbutment.geom3
  );

  const endAbutmentTransformred = geometries.geom3.transform(
    transformZ,
    _endAbutment.geom3
  );

  // Rotate 180 degrees around Z axis and translate to end of bridge
  const rotation = maths.mat4.create();
  const translation = maths.mat4.create();
  maths.mat4.fromZRotation(rotation, Math.PI);

  maths.mat4.fromTranslation(
    translation,
    maths.vec3.fromValues(0, params.bridgeLength * scalingFactor, 0)
  );

  const tm = maths.mat4.create();
  maths.mat4.multiply(tm, translation, rotation);

  const endAbutment = geometries.geom3.transform(tm, endAbutmentTransformred);

  return [
    {
      geom3: startAbutmentTransformed,
      wireframe: startAbutment.wireframe.map((segment) =>
        segment.applyMatrix4(transformZ)
      ),
    },
    {
      geom3: endAbutment,
      wireframe: _endAbutment.wireframe?.map((segment) =>
        segment.applyMatrix4(tm).applyMatrix4(transformZ)
      ),
    },
  ];
};

const createPiles = (params: {
  bridgeLength: number;
  pileDiameter: number;
  pileCapWidth: number;
  pileCapLength: number;
  columns: number;
  rows: number;
  spanCount: number;
  deckThickness: number;
  girderHeight: number;
  pierHeight: number;
}) => {
  const scalingFactor = 0.01;
  const piles = Array.from({ length: params.spanCount - 1 }, (_, i) => {
    const spacing =
      ((i + 1) * params.bridgeLength * scalingFactor) / params.spanCount;
    const pile = createPile({
      ...standardPileParams,
      diameter: params.pileDiameter,
      pilesCapWidth: params.pileCapWidth,
      pilesCapLength: params.pileCapLength,
      columns: params.columns ?? 2,
      rows: params.rows ?? 2,
    });
    const tm = maths.mat4.fromTranslation(
      maths.mat4.create(),
      maths.vec3.fromValues(
        0,
        spacing,
        -params.pierHeight * scalingFactor - params.girderHeight * scalingFactor
      )
    );
    const transformedPile = geometries.geom3.transform(tm, pile.geom3);
    return transformedPile;
  });

  return piles.map((pileGeom) => {
    return {
      geom3: pileGeom,
      wireframe: undefined,
    };
  });
};
