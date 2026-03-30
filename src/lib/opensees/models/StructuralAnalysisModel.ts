import type { IStructuralAnalysisModel } from "./types";

export class Geometry implements IStructuralAnalysisModel {
  BIM;
  description;
  engineer;
  geometry;
  properties;
  units;

  constructor(structuralAnalysisModel: IStructuralAnalysisModel) {
    this.BIM = structuralAnalysisModel.BIM;
    this.description = structuralAnalysisModel.description;
    this.engineer = structuralAnalysisModel.engineer;
    this.geometry = structuralAnalysisModel.geometry;
    this.properties = structuralAnalysisModel.properties;
    this.units = structuralAnalysisModel.units;
  }
}
