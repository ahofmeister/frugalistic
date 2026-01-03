import "../globals.css";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import React, { Suspense } from "react";
import { DashboardMobileNavigation } from "@/components/navigation/dashboard-mobile-navigation";
import MainNavigation from "@/components/navigation/main-navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={"flex h-screen"}>
      <Suspense>
        <MainNavigation />
      </Suspense>
      <main className="px-4 w-full pt-20 lg:pt-8 overflow-y-auto pb-28 lg:pb-4">
        <NuqsAdapter>{children}</NuqsAdapter>
      </main>
      <Suspense>
        <DashboardMobileNavigation />
      </Suspense>
    </div>
  );
}
