"use client";
import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";

export function NewTransactionLink() {
  const { state } = useSidebar();

  return (
    <Link href="/dashboard/transactions/new">
      <SidebarMenuButton asChild tooltip="New Transaction">
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
