"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import React, { ReactElement } from "react";

import { Period } from "@/components/dashboard/period-selector";
import { Button } from "@/components/ui/button";

export function MonthYearStepper({
  incomingYear,
  incomingMonth,
  amount,
  period,
  icon,
}: {
  incomingYear: number;
  incomingMonth: number;
  amount: number;
  period: Period;
  icon: ReactElement;
}) {
  const [month, setMonth] = useQueryState(
    "month",
    parseAsInteger.withDefault(incomingMonth),
  );

  const [year, setYear] = useQueryState(
    "year",
    parseAsInteger.withDefault(incomingYear),
  );

  const handleStep = () => {
    let nextMonth: number | null = month;
    let nextYear = year;

    if (period === "month") {
      nextMonth += amount;
      if (nextMonth === 12) {
        nextMonth = 0;
        nextYear += 1;
      } else if (nextMonth === -1) {
        nextMonth = 11;
        nextYear -= 1;
      }
    } else {
      nextYear += amount;
      nextMonth = null;
    }

    void setMonth(nextMonth);
    void setYear(nextYear);
  };

  return (
    <Button size="sm" variant="outline" onClick={handleStep}>
      {year} -{month}
      {icon}
    </Button>
  );
}
