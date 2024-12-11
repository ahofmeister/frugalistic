import "../globals.css";

import { Analytics } from "@vercel/analytics/next";
import { Metadata } from "next";
import React from "react";

import SiteHeader from "@/components/navigation/siteHeader";

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
    <>
      <SiteHeader />
      <main className="m-10">{children}</main>
      <Analytics />
    </>
  );
}
