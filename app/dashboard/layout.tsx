import "../globals.css";

import React from "react";

import { navConfig } from "@/components/navigation/nav-config";
import Navigation from "@/components/navigation/navigation";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Frugalistic",
  description: "Financial overview",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="text-black bg-white dark:bg-background dark:text-white">
        <Navigation
          items={navConfig.dashboardNavigation}
          loggedIn={true}
          showAppButton={false}
        />
        <main className="m-10">{children}</main>
      </body>
    </html>
  );
}
