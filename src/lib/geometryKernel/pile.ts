import jscad from "@jscad/modeling";

const { primitives, booleans } = jscad;

type PileParams = {
  diameter: number;
  height: number;
  pilesCapHeight: number;
  pilesCapWidth: number;
  pilesCapLength: number;
  rows: number;
  columns: number;
};

export const standardPileParams: PileParams = {
  diameter: 100,
  height: 1000,
  pilesCapHeight: 300,
  pilesCapWidth: 1000,
  pilesCapLength: 1000,
  rows: 2,
  columns: 2,
};

export const createPile = (params: PileParams = standardPileParams) => {
  const scalingFactor = 0.01;
  const d = params.diameter * scalingFactor;
  const h = params.height * scalingFactor;
  const pch = params.pilesCapHeight * scalingFactor;
  const pcw = params.pilesCapWidth * scalingFactor;
  const pcl = params.pilesCapLength * scalingFactor;
  // piles arrangement
  const rows = params.rows > 1 ? params.rows : 1;
  const columns = params.columns > 1 ? params.columns : 1;

  // precalculations
  const columnSpacing = pcw / (columns + 1);
  const rowSpacing = pcl / (rows + 1);
  const pcw2 = pcw / 2;
  const pcl2 = pcl / 2;
  const pwh2 = pch / 2;

  const pileCap = primitives.cuboid({
    size: [pcl, pcw, pch],
    center: [0, 0, -pwh2],
  });

  const piles: geometries.geom3.Geom3[] = [];

  Array.from({ length: rows }, (_, rowIndex) => {
    Array.from({ length: columns }, (_, columnIndex) => {
      piles.push(
        primitives.cylinder({
          height: h,
          radius: d / 2,
          segments: 32,
          center: [
            -pcl2 + rowSpacing * (rowIndex + 1),
            -pcw2 + columnSpacing * (columnIndex + 1),
            -pwh2 - h / 2,
          ],
        })
      );
    });
  });

  const allPiles = booleans.union(...piles, pileCap);

  return {
    geom3: allPiles,
    wireframe: undefined,
  };
};
