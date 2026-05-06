import { DashboardLayoutView } from "@/modules/dashboard/ui/views/dashboard-layout-view";
import React from "react";

const DashboardLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return <DashboardLayoutView>{children}</DashboardLayoutView>;
};

export default DashboardLayout;
