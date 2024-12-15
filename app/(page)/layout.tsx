import "../globals.css";

import React from "react";

import SiteHeader from "@/components/navigation/siteHeader";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="m-10">{children}</main>
    </>
  );
}
