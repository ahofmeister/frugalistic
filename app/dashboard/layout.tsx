import "../globals.css";

import React from "react";

import { SettingsProvider } from "@/app/dashboard/settings/use-setting";
import { DashboardMobileNavigation } from "@/components/navigation/dashboard-mobile-navigation";
import DashboardNavigation from "@/components/navigation/dashboard-navigation";
import { Setting } from "@/types";
import { createClient } from "@/utils/supabase/server";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("setting")
    .select("*")
    .single();

  return (
    <div className="h-screen">
      <DashboardNavigation />
      <main className="p-2 mx-2 flex-1 overflow-y-auto">
        <SettingsProvider
          setting={settings ?? ({ date_format: "dd.MM.yyyy" } as Setting)}
        >
          {children}
        </SettingsProvider>
      </main>
      <DashboardMobileNavigation />
    </div>
  );
}
