import { betterAuth, GenericEndpointContext } from "better-auth";
import {
	organization,
	admin,
	multiSession,
	Organization,
	Team,
} from "better-auth/plugins";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import * as schema from "@/modules/auth/schema";
import { db } from "./db";
import email from "@/modules/email";

export const auth = betterAuth({
	appName: "MoPo",
	plugins: [
		admin(),
		organization({
			teams: {
				enabled: true,
				defaultTeam: {
					enabled: true,
					customCreateDefaultTeam: async (
						organization: Organization,
					): Promise<Team & Record<string, string>> => {
						return (await auth.api.createTeam({
							body: {
								name: organization.name,
								organizationId: organization.id,
							},
						})) as Team & Record<string, string>;
					},
				},
			},
		}),
		multiSession(),
	],
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

	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		},
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
	},

	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					await auth.api.createOrganization({
						body: {
							name: user.name.toLowerCase(),
							slug: `${user.name.toLowerCase().replace(/\s+/g, "-")}-${user.id.slice(0, 6)}`,
							userId: user.id,
							keepCurrentActiveOrganization: false,
						},
					});
				},
			},
		},
	},
});
