"use client";

import React, { ReactElement } from "react";

import useUpdateQueryParam from "@/app/useUpdateQueryParam";
import { Period } from "@/components/dashboard/period-selector";
import { Button } from "@/components/ui/button";

export function MonthYearStepper({
  year,
  month,
  amount,
  period,
  icon,
}: {
  year: number;
  month: number;
  amount: number;
  period: Period;
  icon: ReactElement;
}) {
  const updateQueryParam = useUpdateQueryParam();

  const handleStep = () => {
    let nextMonth: number | undefined = month;
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
      nextMonth = undefined;
    }

    updateQueryParam([
      { key: "month", value: nextMonth?.toString() },
      { key: "year", value: nextYear.toString() },
    ]);
  };

  return (
    <Button variant="outline" onClick={handleStep}>
      {icon}
    </Button>
  );
}
