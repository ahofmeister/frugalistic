import "../globals.css";

import React from "react";

import { navConfig } from "@/components/navigation/nav-config";
import Navigation from "@/components/navigation/navigation";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="text-black bg-white dark:bg-background dark:text-white">
        <Navigation
          items={navConfig.publicNavigation}
          loggedIn={false}
          showAppButton={true}
        />

        <main className="m-10">{children}</main>
      </body>
    </html>
  );
}
