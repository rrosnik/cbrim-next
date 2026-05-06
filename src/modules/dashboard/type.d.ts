declare global {
	namespace Sidebar {
		type SidebarMenuItem = {
			label: string;
			url: string;
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
