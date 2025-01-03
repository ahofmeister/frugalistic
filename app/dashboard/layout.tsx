import "../globals.css";

import { cookies } from "next/headers";
import React from "react";

import { SettingsProvider } from "@/app/dashboard/settings/use-setting";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Setting } from "@/types";
import { createClient } from "@/utils/supabase/server";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value !== "false";

  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("setting")
    .select("*")
    .single();

  return (
    <div className="h-screen">
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="absolute left-2 top-2 size-fit">
          <SidebarTrigger />
        </div>
        <AppSidebar />
        <main className="p-2 mx-2 mt-8 md:mt-4 flex-1 overflow-y-auto">
          <SettingsProvider
            setting={settings ?? ({ date_format: "dd.MM.yyyy" } as Setting)}
          >
            {children}
          </SettingsProvider>
        </main>
      </SidebarProvider>
    </div>
  );
}
