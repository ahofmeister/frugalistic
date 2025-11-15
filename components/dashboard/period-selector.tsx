"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useQueryState } from "nuqs";
import { parsePeriod } from "@/lib/utils";

export type Period = "month" | "year";

export function PeriodSelector() {
  const [period, setPeriod] = useQueryState("period", parsePeriod);

  return (
    <ToggleGroup
      type="single"
      value={period}
      className="justify-start"
      onValueChange={(newPeriod: Period) => {
        if (!newPeriod) {
          return;
        }
        void setPeriod(newPeriod);
      }}
    >
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
      <ToggleGroupItem value="year">Year</ToggleGroupItem>
    </ToggleGroup>
  );
}
