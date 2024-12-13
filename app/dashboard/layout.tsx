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
  const defaultOpen = cookieStore.get("sidebar:state")?.value !== "false";

  return (
    <div className="h-screen">
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="absolute left-2 top-2 size-fit">
          <SidebarTrigger />
        </div>
        <AppSidebar />
        <main className="p-2 mx-2 mt-8 md:mt-4 flex-1 overflow-y-auto">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
