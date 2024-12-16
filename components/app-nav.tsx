"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navConfig } from "@/components/navigation/nav-config";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppNav() {
  const items = navConfig.dashboardNavigation;
  const pathname = usePathname();
  const sidebar = useSidebar();

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
                onClick={() => sidebar.toggleSidebar()}
              >
                <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                  {item.icon && <item.icon />}
                  {item.title}
                </SidebarMenuButton>
              </Link>
              <SidebarMenuSub>
                {item.items?.map((subItem) => {
                  const isActive = pathname === subItem.href;
                  return (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild isActive={isActive}>
                        <Link href={subItem.href}>{subItem.title}</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
