"use client";

import React from "react";

import { MainNav } from "@/components/navigation/main-nav";
import { navConfig } from "@/components/navigation/nav-config";
import { PublicMobileNavigation } from "@/components/navigation/public-mobile-navigation";

export function PublicNavigation() {
  return (
    <header className="sticky top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <div className="flex h-14 pl-4">
        <MainNav items={navConfig.publicNavigation} showAppButton={true} />
        <PublicMobileNavigation />
      </div>
    </header>
  );
}
