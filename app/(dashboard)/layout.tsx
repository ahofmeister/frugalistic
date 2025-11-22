import "../globals.css";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import React, { Suspense } from "react";
import { DashboardMobileNavigation } from "@/components/navigation/dashboard-mobile-navigation";
import MainNavigation from "@/components/navigation/main-navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={"flex h-screen"}>
      <MainNavigation />
      <main className="p-4 w-full pt-16 lg:pt-0 overflow-y-auto pb-28 lg:pb-4">
        <NuqsAdapter>{children}</NuqsAdapter>
      </main>
      <Suspense>
        <DashboardMobileNavigation />
      </Suspense>
    </div>
  );
}
