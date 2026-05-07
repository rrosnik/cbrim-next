import { createSelectSchema } from "drizzle-zod";
import { organization } from "./schema";

export const organization_insert_schema = createSelectSchema(organization).omit(
	{ id: true, createdAt: true, updatedAt: true },
);
