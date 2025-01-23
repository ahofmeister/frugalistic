"use client";
import { parseAsInteger, useQueryState } from "nuqs";
import React from "react";

import { Button } from "@/components/ui/button";

export function SelectNow() {
  const [, setYear] = useQueryState("year", parseAsInteger);
  const [, setMonth] = useQueryState("month", parseAsInteger);

  return (
    <Button
      variant="outline"
      onClick={function () {
        const currentDate = new Date();

        void setYear(currentDate.getFullYear());
        void setMonth(currentDate.getMonth());
      }}
    >
      Now
    </Button>
  );
}
