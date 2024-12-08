"use client";
import React from "react";

import useUpdateQueryParam from "@/app/useUpdateQueryParam";
import { Button } from "@/components/ui/button";

export function DashboardSelectToday() {
  const update = useUpdateQueryParam();
  return (
    <Button
      variant="outline"
      onClick={() => {
        update([
          { key: "month", value: new Date().getMonth().toString() },
          {
            key: "year",
            value: new Date().getFullYear().toString(),
          },
        ]);
      }}
    >
      Today
    </Button>
  );
}
