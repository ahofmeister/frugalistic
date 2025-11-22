import "../globals.css";

import { Analytics } from "@vercel/analytics/next";
import React from "react";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="m-10">{children}</main>
      <Analytics />
    </>
  );
}
