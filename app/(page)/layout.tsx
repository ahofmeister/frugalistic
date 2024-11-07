import "../globals.css";

import { Metadata } from "next";
import React from "react";

import { navConfig } from "@/components/navigation/nav-config";
import Navigation from "@/components/navigation/navigation";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Frugalistic",
  description: "The best way to stay on top of your finances",
  keywords: [
    "frugal",
    "expense tracker",
    "income tracker",
    "savings",
    "finance management",
    "transactions",
    "recurring payments",
  ],
};

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="text-black bg-white dark:bg-background dark:text-white">
        <Navigation items={navConfig.publicNavigation} publicArea={true} />

        <main className="m-10">{children}</main>
      </body>
    </html>
  );
}
