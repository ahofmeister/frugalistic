"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navConfig } from "@/components/navigation/nav-config";
import { cn } from "@/lib/utils";

export function DashboardMobileNavigation() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 shrink-0 border-t bg-background md:hidden pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <div className="flex h-20 justify-between items-center px-2">
        {navConfig.dashboardNavigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col  w-full gap-1 items-center justify-center",
              pathname === item.href
                ? "text-primary"
                : "text-muted-foreground hover:text-primary",
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
