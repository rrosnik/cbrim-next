import React from "react";

declare global {
	namespace Sidebar {
		type SidebarMenuItem = {
			label: string;
			url: string;
			Icon: React.ReactNode;
		};
		type SidebarGroup = {
			label: string;
			action?: {
				label: string;
				Icon: Reac.ReactNode;
			};
			collapsible?: true;
			items: SidebarMenuItem[];
		};
	}
}

export {};
