"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import AppButton from "@/components/auth/app-button";
import { navConfig } from "@/components/navigation/nav-config";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex w-full">
      <nav className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4 text-sm xl:gap-6">
          {navConfig.publicNavigation.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname.startsWith(item.href)
                  ? "text-foreground"
                  : "text-foreground/80",
              )}
            >
              <div className="flex gap-x-1 items-center">
                {item.title}
                {item.external && <ArrowUpRight size="15" />}
              </div>
            </Link>
          ))}
        </div>
        <div>
          <AppButton />
        </div>
      </nav>
    </div>
  );
}
