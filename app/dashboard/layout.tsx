import "../globals.css";

import React from "react";

import DashboardNavigation from "@/components/dashboard/dashboard-navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-white">
        <div className="flex h-screen">
          <DashboardNavigation />
          <main className="mx-10 my-5 flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
