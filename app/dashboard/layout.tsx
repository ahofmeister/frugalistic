import "../globals.css";

import { cookies } from "next/headers";
import React from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <html lang="en" className="dark">
      <body className="bg-background text-white">
        <div className="flex h-screen">
          <SidebarProvider defaultOpen={defaultOpen}>
            <SidebarTrigger />
            <AppSidebar />
            <main className="m-6 flex-1 overflow-y-auto">{children}</main>
          </SidebarProvider>
        </div>
      </body>
    </html>
  );
}
