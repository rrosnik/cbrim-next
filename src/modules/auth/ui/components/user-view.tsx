"use client";

import {
	type UsernameAuthClient,
	useAuth,
	useSession,
} from "@better-auth-ui/react";
import type { User } from "better-auth";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";

export type UserViewProps = {
	className?: string;
	isPending?: boolean;
	/** @remarks `User` */
	user?: User & { username?: string | null; displayUsername?: string | null };
	isOnline?: boolean;
};

/**
 * Render a compact user item with an avatar, a primary label (display username, name, or email), and an optional secondary email line.
 *
 * @param isPending - If true and no `user` prop is provided, renders a loading skeleton instead of user details
 * @param className - Additional CSS classes applied to the outer container
 * @param user - Optional user object to display; when omitted the current session user is used
 * @returns A React element showing the user's avatar with their identifying information
 */
export function UserView({
	className,
	isPending,
	user,
	isOnline,
}: UserViewProps) {
	const { authClient } = useAuth();
	const { data: session, isPending: sessionPending } = useSession(
		authClient as UsernameAuthClient,
		{ enabled: !user && !isPending },
	);

	const resolvedUser = user ?? session?.user;

	if ((isPending || sessionPending) && !user) {
		return (
			<div className={cn("flex items-center gap-2", className)}>
				<UserAvatar isPending />

				<div className="grid flex-1 gap-1 text-left text-sm">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-3 w-32" />
				</div>
			</div>
		);
	}

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<div className="relative">
				<UserAvatar user={resolvedUser} />
				{(isOnline === true || isOnline === false) && (
					<span
						className={cn(
							"ring-card absolute right-0 bottom-0 block size-2 rounded-full ring-2",
							isOnline === true ? " bg-green-600" : "bg-red-600",
						)}
					/>
				)}
			</div>

			<div className="grid flex-1 text-left text-sm leading-tight">
				<span className="truncate font-medium text-foreground">
					{resolvedUser?.displayUsername ||
						resolvedUser?.name ||
						resolvedUser?.email}
				</span>

				{(resolvedUser?.displayUsername || resolvedUser?.name) && (
					<span className="text-muted-foreground truncate text-xs">
						{resolvedUser?.email}
					</span>
				)}
			</div>
		</div>
	);
}
