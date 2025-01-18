import "../globals.css";

import { Analytics } from "@vercel/analytics/next";
import React from "react";

import { PublicNavigation } from "@/components/navigation/public-navigation";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNavigation />
      <main className="m-10">{children}</main>
      <Analytics />
    </>
  );
}
