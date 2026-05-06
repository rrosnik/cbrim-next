"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
// import { deleteUserPlugin } from "@/lib/auth/delete-user-plugin";
import { AuthProvider as _AuthProvider } from "./ui/components/auth-provider";
import { Toaster } from "sonner";
import { authClient } from "@/lib/authClient";

export function AuthProvider({ children }: { children: ReactNode }) {
	const router = useRouter();

	return (
		<_AuthProvider
			authClient={authClient}
			redirectTo="/settings/account"
			socialProviders={["google", "github"]}
			navigate={({ to, replace }) =>
				replace ? router.replace(to) : router.push(to)
			}
			// plugins={[deleteUserPlugin()]}
			Link={Link}
		>
			{children}

			<Toaster />
		</_AuthProvider>
	);
}
