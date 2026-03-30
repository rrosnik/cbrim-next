import z from "zod";

export const commonElementProps = {
    name: z.number(),
    nodes: z.array(z.number()),
    material: z.string().nullish(),
}

export const PrismFrame3d_Schema = z
  .object({
    ...commonElementProps,
    type: z.literal("PrismFrame3d"),
    massperlength: z.number(),
    releasez: z.number(),
    releasey: z.number(),
    transform: z.number(),
    shear_flag: z.number(),
    section: z.number().nullish(),
    E: z.number(),
    G: z.number(),
    A: z.number(),
    Ay: z.number(),
    Az: z.number(),
    Jx: z.number(),
    Iy: z.number(),
    Iz: z.number(),
  })
  .strict();

export const elementSchema = z.discriminatedUnion("type", [
  PrismFrame3d_Schema,
]);
