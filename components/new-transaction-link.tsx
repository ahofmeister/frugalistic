"use client";
import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";

export function NewTransactionLink() {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const pathname = usePathname();
  const isActive = pathname.startsWith("/dashboard/transactions/new");
  return (
    <Link
      href="/dashboard/transactions/new"
      onClick={() => isMobile && toggleSidebar()}
    >
      <SidebarMenuButton asChild isActive={isActive} tooltip="New Transaction">
        {state === "expanded" ? (
          <Button variant="outline">
            <div className="flex">New Transaction</div>
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <PlusIcon />
          </Button>
        )}
      </SidebarMenuButton>
    </Link>
  );
}
