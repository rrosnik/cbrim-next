import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { UserButton } from "@/modules/auth/ui/components/user-button";
import { ChevronDown, PlusIcon, UserIcon } from "lucide-react";
import { organizationSidebar } from "../constants";
import { TeamSwitcher } from "./team-switcher";
import { Separator } from '@/components/ui/separator';

export const Sidebar_Icon = () => {
	const { state, isMobile } = useSidebar();

	return (
		<Sidebar
			variant="sidebar"
			collapsible={"offcanvas"}
			style={
				{
					"--sidebar-width-icon": "2rem",
				} as React.CSSProperties
			}
		>
			<SidebarHeader>
				<TeamSwitcher
					teams={[
						{
							logo: UserIcon,
							name: "asdasdad",
							plan: "enterprise",
						},
					]}
				/>
			</SidebarHeader>
			<Separator />
			<SidebarContent>
				{organizationSidebar.map((org) => (
					<SidebarGroup key={org.label}>
						<SidebarGroupLabel>{org.label}</SidebarGroupLabel>
						<SidebarGroupAction>
							<PlusIcon /> <span className="sr-only">Add Project</span>
						</SidebarGroupAction>
						<SidebarGroupContent></SidebarGroupContent>
					</SidebarGroup>
				))}
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupAction>
						<PlusIcon /> <span className="sr-only">Add Project</span>
					</SidebarGroupAction>
					<SidebarGroupContent></SidebarGroupContent>
				</SidebarGroup>
				<Collapsible defaultOpen className="group/collapsible">
					<SidebarGroup>
						<SidebarGroupLabel asChild>
							<CollapsibleTrigger>
								Help
								<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						{/* <SidebarMenu>
							{organizationSidebar.map((project) => (
								<SidebarMenuItem key={project.label}>
									<SidebarMenuButton asChild>
										<a href={project.url}>
											<project.icon />
											<span>{project.name}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu> */}
						<CollapsibleContent>
							<SidebarGroupContent />
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>
			</SidebarContent>
			<SidebarFooter>
				
				<SidebarMenu>
					<SidebarMenuItem>
						
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};
