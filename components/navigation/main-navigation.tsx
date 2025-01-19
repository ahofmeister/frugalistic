"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import AppButton from "@/components/auth/app-button";
import { NavItem } from "@/components/navigation/nav-config";
import { siteConfig } from "@/components/site-config";
import { cn } from "@/lib/utils";

export function MainNavigation(props: {
  items: NavItem[];
  showAppButton: boolean;
}) {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex w-full">
      <Link
        href="/"
        className="flex font-semibold text-primary text-xl items-center px-6"
      >
        {siteConfig.name}
      </Link>
      <nav className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4 text-sm xl:gap-6">
          {props.items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary",
              )}
            >
              <div className="flex gap-x-1 items-center">
                {item.title}
                {item.external && <ArrowUpRight size="15" />}
              </div>
            </Link>
          ))}
        </div>
        {props.showAppButton && <AppButton />}
      </nav>
    </div>
  );
}
