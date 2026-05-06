"use client";

import type { Organization } from "better-auth/plugins";
import { User2 } from "lucide-react";
import type { ReactNode } from "react";
import { BsPersonWorkspace } from "react-icons/bs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type OrganizationAvatarProps = {
	className?: string;
	fallback?: ReactNode;
	isPending?: boolean;
	/** @remarks `User` */
	organization: Organization;
};

/**
 * Display a user's avatar using session information or an explicit user prop.
 *
 * Renders a circular avatar that shows the user's image when available, a fallback node if provided, or the user's first two initials; while the session is loading (or when `isPending` is true) and no `user` prop is supplied, renders a skeleton placeholder.
 *
 * @param className - Additional CSS classes applied to the avatar container
 * @param user - Optional user object to display instead of the session user
 * @param isPending - When true, treat the component as loading and show the skeleton if no `user` is provided
 * @param fallback - Node to render inside the avatar fallback area before initials or the default icon
 * @returns The avatar element to render (JSX)
 */
export function OrganizationAvatar({
	className,
	organization,
	isPending,
	fallback,
}: OrganizationAvatarProps) {
	if (isPending && !organization) {
		return <Skeleton className={cn("size-8 rounded-non", className)} />;
	}

	const initials = organization?.name?.slice(0, 2).toUpperCase();

	return (
		<Avatar
			className={cn(
				"size-full bg-sidebar-primary text-foreground text-sm rounded-lg",
				"after:border-none",
				className,
			)}
		>
			<AvatarImage
				src={organization?.logo ?? undefined}
				alt={organization?.name}
				className='rounded-lg size-full'
			/>

			<AvatarFallback delayMs={organization?.logo ? 600 : undefined} className='size-full rounded-lg bg-sidebar-primary'>
				{fallback || initials || <BsPersonWorkspace className="size-full rounded-lg" />}
			</AvatarFallback>
		</Avatar>
	);
}

//
