"use client";
import React from "react";

import useUpdateQueryParam from "@/app/useUpdateQueryParam";
import { Button } from "@/components/ui/button";

export function SelectNow() {
  const update = useUpdateQueryParam();

  const handleClick = () => {
    const currentDate = new Date();

    update([
      {
        key: "year",
        value: currentDate.getFullYear().toString(),
      },
      { key: "month", value: currentDate.getMonth().toString() },
    ]);
  };

  return (
    <Button variant="outline" onClick={handleClick}>
      Now
    </Button>
  );
}
