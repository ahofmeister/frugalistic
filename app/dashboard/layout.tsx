import "../globals.css";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import React, { Suspense } from "react";
import { DashboardMobileNavigation } from "@/components/navigation/dashboard-mobile-navigation";
import DashboardNavigation from "@/components/navigation/dashboard-navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen">
      <DashboardNavigation />
      <main className="p-2 mx-2 flex-1 overflow-y-auto pb-[calc(5rem+env(safe-area-inset-bottom))]">
        <NuqsAdapter>{children}</NuqsAdapter>
      </main>
      <Suspense>
        <DashboardMobileNavigation />
      </Suspense>
    </div>
  );
}
