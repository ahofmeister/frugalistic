import "../globals.css";

import { redirect } from "next/navigation";
import React from "react";

import { navConfig } from "@/components/navigation/nav-config";
import Navigation from "@/components/navigation/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <html lang="en" className="dark">
      <body className="bg-background text-white">
        <Navigation items={navConfig.dashboardNavigation} publicArea={false} />
        <main className="m-10">{children}</main>
      </body>
    </html>
  );
}
