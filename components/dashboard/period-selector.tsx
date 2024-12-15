"use client";
import { useState } from "react";

import useUpdateQueryParam from "@/app/useUpdateQueryParam";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type Period = "month" | "year";

export function PeriodSelector(props: { value: Period; year: number }) {
  const [period, setPeriod] = useState<Period>(props.value ?? "month");
  const updateQueryParam = useUpdateQueryParam();

  return (
    <ToggleGroup
      type="single"
      value={period}
      className="justify-start"
      onValueChange={(newPeriod: Period) => {
        if (!newPeriod) {
          return;
        }
        setPeriod(newPeriod);

        const newVar = [
          { key: "period", value: newPeriod },
          { key: "year", value: props.year.toString() },
          {
            key: "month",
            value:
              newPeriod === "month"
                ? new Date().getMonth().toString()
                : undefined,
          },
        ];

        updateQueryParam(newVar);
      }}
    >
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
      <ToggleGroupItem value="year">Year</ToggleGroupItem>
    </ToggleGroup>
  );
}
