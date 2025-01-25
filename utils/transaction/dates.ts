import { endOfMonth, endOfYear, format } from "date-fns";

import { Period } from "@/components/dashboard/period-selector";

export function getPeriodDates(year: number, month: number, period: Period) {
  const isYear = period === "year";

  const startDate = isYear ? new Date(year, 0, 1) : new Date(year, month, 1);

  const endDate = isYear
    ? endOfYear(new Date(year, 0, 1))
    : endOfMonth(new Date(year, month, 1));

  return {
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd"),
  };
}
