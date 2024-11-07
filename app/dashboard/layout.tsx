import "../globals.css";

import React from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-white">
        <div className="flex h-screen">
          <SidebarProvider>
            <SidebarTrigger />
            <AppSidebar />
            <main className="m-10 flex-1 overflow-y-auto">{children}</main>
          </SidebarProvider>
        </div>
      </body>
    </html>
  );
}
