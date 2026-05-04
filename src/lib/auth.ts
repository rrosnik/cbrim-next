import { betterAuth } from "better-auth";
import { organization, admin, multiSession } from "better-auth/plugins";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import * as schema from "@/modules/auth/schema";
import { db } from "./db";

export const auth = betterAuth({
	appName: "MoPo",
	plugins: [admin(), organization(), multiSession()],
	database: drizzleAdapter(db, {
		provider: "pg", // or "pg" or "mysql"
		schema: { ...schema },
	}),
	emailAndPassword: {
		enabled: true,
	},
});
