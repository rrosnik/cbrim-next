import z from "zod";
import { organization_insert_schema } from "./validations";

declare global {
	namespace Auth {
		type Organization_Insert = z.infer<typeof organization_insert_schema>;
	}
}
