import { betterAuth } from "better-auth";
import { organization, admin, multiSession } from "better-auth/plugins";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import * as schema from "@/modules/auth/schema";
import { db } from "./db";
import email from "@/modules/email";

export const auth = betterAuth({
	appName: "MoPo",
	plugins: [admin(), organization(), multiSession()],
	database: drizzleAdapter(db, {
		provider: "pg", // or "pg" or "mysql"
		schema: { ...schema },
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			void email.sendResetPassword({
				userName: user.name,
				email: user.email,
				resetUrl: url,
			});
		},
	},
	// Email verification settings
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,

		// Send verification emails via Resend
		sendVerificationEmail: async ({ user, url }) => {
			void email.sendVerification({
				userName: user.name,
				email: user.email,
				verificationUrl: url,
			});
		},
		expiresIn: 3600, // in seconds
	},
});
