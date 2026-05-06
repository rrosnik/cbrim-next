import { PlusIcon } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

import { organizationSidebar } from "../../constants";
import { UserButton } from "@/modules/auth/ui/components/user-button";
import { OrganizationButton } from "@/modules/auth/ui/components/organization-button";

export const Sidebar_Icon = () => {
	return (
		<Sidebar
			variant="sidebar"
			collapsible={"offcanvas"}
			className="data-[sidebar=menu-item]:justify-center data-[sidebar=menu-item]:flex"
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild className="h-auto">
							<OrganizationButton />
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				{organizationSidebar.map((group) => (
					<SidebarGroup key={group.label}>
						<SidebarGroupLabel>{group.label}</SidebarGroupLabel>
						<SidebarGroupAction>
							<PlusIcon /> <span className="sr-only">Add Project</span>
						</SidebarGroupAction>
						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map((item) => (
									<SidebarMenuItem key={item.label}>
										<SidebarMenuButton asChild>
											<a href={item.url}>
												{item.Icon}
												<span>{item.label}</span>
											</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<UserButton
								className="h-fit"
								size="default"
								side="top"
								align="end"
							/>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};
