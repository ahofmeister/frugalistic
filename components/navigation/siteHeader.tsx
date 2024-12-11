import Link from "next/link";
import React from "react";

import { MainNav } from "@/components/navigation/main-nav";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { siteConfig } from "@/components/site-config";

const SiteHeader = () => {
  return (
    <header className="sticky top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <div className="flex h-14 pl-4">
        <Link
          href="/"
          className="flex font-semibold text-primary text-xl items-center px-6"
        >
          {siteConfig.name}
        </Link>
        <div className="w-full flex">
          <MainNav />
        </div>
        <MobileNav />
      </div>
    </header>
  );
};

export default SiteHeader;
