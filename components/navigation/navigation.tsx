"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { docsConfig } from "@/components/navigation/docs-config";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 lg:mr-6">
        <span className="hidden font-bold lg:inline-block">Frugalistic</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        {docsConfig.mainNav.map((item) => (
          <Link
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === item.href ? "text-primary" : "text-foreground/60",
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Navigation;
