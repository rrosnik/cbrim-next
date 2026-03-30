/* eslint-disable @typescript-eslint/no-empty-object-type */
import z from "zod";
import {
  constraintSchema,
  elementSchema,
  geometrySchema,
  nodeSchema,
  structuralAnalysisModelSchema,
  openseesModelSchema,
} from "./schema";

export interface INode extends z.infer<typeof nodeSchema> {}

export interface IElement extends z.infer<typeof elementSchema> {}

export interface IConstraint extends z.infer<typeof constraintSchema> {}

export interface IGeometry extends z.infer<typeof geometrySchema> {}

export interface IStructuralAnalysisModel extends z.infer<
  typeof structuralAnalysisModelSchema
> {}

export interface IOpenseesModel extends z.infer<typeof openseesModelSchema> {}
