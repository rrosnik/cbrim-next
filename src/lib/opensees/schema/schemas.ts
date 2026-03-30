import z from "zod";
import { elementSchema } from './elementsSchema';

export const nodeSchema = z
  .object({
    name: z.number(),
    ndf: z.number(),
    crd: z.union([
      z.tuple([z.number(), z.number()]),
      z.tuple([z.number(), z.number(), z.number()]),
    ]),
  })
  .strict();


export const constraintSchema = z
  .object({
    name: z.number(),
    node: z.number(),
    dof: z.number(),
    ref_value: z.number(),
  })
  .strict();

export const geometrySchema = z.object({
  nodes: z.array(nodeSchema),
  elements: z.array(elementSchema),
  constraints: z.array(constraintSchema),
});

export const structuralAnalysisModelSchema = z.object({
  BIM: z.any().nullish(),
  description: z.string().nullish(),
  engineer: z.string().nullish(),
  units: z.any().nullish(),
  properties: z.any(),
  geometry: geometrySchema,
});

export const openseesModelSchema = z
  .object({
    StructuralAnalysisModel: structuralAnalysisModelSchema,
  })
  .strict();
