import "../globals.css";
import React from "react";

import { navConfig } from "@/components/navigation/nav-config";
import Navigation from "@/components/navigation/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-white">
        <Navigation items={navConfig.dashboardNavigation} publicArea={false} />
        <main className="m-10">{children}</main>
      </body>
    </html>
  );
}
