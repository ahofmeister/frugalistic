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
      <main className="pb-[calc(5rem+env(safe-area-inset-bottom))] p-4 w-full pt-20 lg:pt-8">
        <NuqsAdapter>{children}</NuqsAdapter>
      </main>
      <Suspense>
        <DashboardMobileNavigation />
      </Suspense>
    </div>
  );
}
