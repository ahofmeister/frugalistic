import * as React from "react";

import FeedbackButton from "@/app/dashboard/feedback-button";
import { AppNav } from "@/components/app-nav";
import { AppSidebarHeader } from "@/components/app-sidebar-header";
import NavUser from "@/components/nav-user";
import { NewTransactionLink } from "@/components/new-transaction-link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const supabase = await createClient();
  const { data: user } = await supabase.from("profile").select("*").single();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppSidebarHeader />
        <NewTransactionLink />
      </SidebarHeader>
      <SidebarContent>
        <AppNav />
      </SidebarContent>
      <SidebarFooter>
        <FeedbackButton />
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
