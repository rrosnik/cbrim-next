"use client";

import { useState } from "react";
import { ChevronsUpDown, PlusIcon } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/authClient";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { OrganizationAvatar } from "./organization-avatar";
import { OrganizationCreateDiaog } from "./organization-creation-dialog";
import { Badge } from "@/components/ui/badge";
import { Organization } from "better-auth/plugins";

export type OrganizationButtonProps = {
	className?: string;
	align?: React.ComponentProps<typeof DropdownMenuContent>["align"];
	side?: React.ComponentProps<typeof DropdownMenuContent>["side"];
	sideOffset?: number;
	size?: "default" | "icon";
};

export function OrganizationButton({
	className,
	align,
	side,
	sideOffset,
	size = "default",
}: OrganizationButtonProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { data: orgList } = authClient.useListOrganizations();
	const { data: session } = authClient.useSession();
	const { data: activeOrg } = authClient.useActiveOrganization();

	return (
		<>
			<OrganizationCreateDiaog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger
					className={cn(
						size === "icon" && "rounded-full",
						size === "icon" && className,
					)}
					asChild={size === "default"}
				>
					<SidebarMenuButton
						size="lg"
						className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<div className="flex aspect-square size-8 items-center justify-center   text-sidebar-primary-foreground">
							<OrganizationAvatar organization={activeOrg as Organization} />
						</div>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{activeOrg?.name}</span>
							<Badge className="bg-primary/10 px-2 text-xs font-medium text-primary w-fit">
								{
									activeOrg?.members.find(
										(mem) => mem.userId === session?.user.id,
									)?.role
								}
							</Badge>
						</div>
						<ChevronsUpDown className="ml-auto" />
					</SidebarMenuButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="min-w-xs rounded-lg"
					align={align ?? "start"}
					side={side ?? "bottom"}
					sideOffset={sideOffset}
				>
					<DropdownMenuLabel className="text-xs text-muted-foreground">
						Organization
					</DropdownMenuLabel>
					{orgList?.map((org) => (
						<DropdownMenuItem
							key={org.slug}
							onClick={() =>
								authClient.organization.setActive({ organizationId: org.id })
							}
							className="gap-2 p-2"
						>
							<OrganizationAvatar organization={org} className="size-7" />
							<span className="truncate">{org.name}</span>
						</DropdownMenuItem>
					))}
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="gap-2 p-2"
						onClick={() => {
							console.log("CLiCKED");
							setIsDialogOpen(true);
						}}
					>
						<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
							<PlusIcon className="size-4" />
						</div>
						<div className="font-medium text-muted-foreground">Add team</div>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
