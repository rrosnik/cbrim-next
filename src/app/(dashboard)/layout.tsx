import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import React from "react";

const DashboardLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <SidebarProvider open={false}>
      <DashboardSidebar />
      <main className="flex flex-col flex-1 h-svh max-h-svh w-screen bg-muted overflow-hidden">
        <DashboardNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
