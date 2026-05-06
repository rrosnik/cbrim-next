"use client";

import React from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar_Icon } from "../components/sidebar_Icon";
import { Header } from "../components/header";

export const DashboardLayoutView: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	return (
		// it checks if it wa mobile it does not force it to be collapsed
		<SidebarProvider className="min-h-full">
			<Sidebar_Icon />
			<SidebarInset>
				<Header />
				<main>{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
};
