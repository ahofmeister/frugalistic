import "../globals.css";

import { cookies } from "next/headers";
import React from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <div className="flex h-screen">
      <SidebarProvider defaultOpen={defaultOpen}>
        <SidebarTrigger />
        <AppSidebar />
        <main className="mx-2 mt-6 flex-1 overflow-y-auto">{children}</main>
      </SidebarProvider>
    </div>
  );
}
