import * as React from "react";

import { AppSidebarHeader } from "@/components/app-sidebar-header";
import { NavMain } from "@/components/nav-main";
import { navConfig } from "@/components/navigation/nav-config";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";

import NavUser from "./nav-user";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navConfig.dashboardNavigation} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
