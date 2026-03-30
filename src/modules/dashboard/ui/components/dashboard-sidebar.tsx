"use client";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Code2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const firstSection = [
  {
    icon: Code2Icon,
    label: "Live Codeing",
    href: "/live-coding",
  },
];

export const DashboardSidebar = () => {
  const pathName = usePathname();
  const { open: desktopOpen, openMobile } = useSidebar();
  const isOpen = desktopOpen || openMobile;
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="text-sidebar-foreground">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" height={36} width={36} alt="logo" />
          {isOpen && <p className="text-2xl font-semibold">CBrIM</p>}
        </Link>
      </SidebarHeader>
      <div>
        <Separator className="opacity-10 " />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10  border border-transparent hover:border-[#5D6B68]/10 ",
                      "hover:bg-linear-to-r/oklch from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                      pathName === item.href &&
                        "bg-linear-to-r/oklch border-[#5D6B68]/10 ",
                    )}
                    isActive={pathName === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-1" />
                      {isOpen && (
                        <span className="text-sm font-medium tracking-normal">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div>
          <Separator className="opacity-10 " />
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
