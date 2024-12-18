"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navConfig } from "@/components/navigation/nav-config";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppNav() {
  const items = navConfig.dashboardNavigation;
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <SidebarMenuItem key={item.href}>
              <Link
                href={item.href}
                className="flex"
                onClick={() => isMobile && toggleSidebar()}
              >
                <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                  {item.icon && <item.icon />}
                  {item.title}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
