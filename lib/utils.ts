import { type ClassValue, clsx } from "clsx";
import {
  endOfMonth,
  endOfYear,
  format as formatDate,
  startOfMonth,
  startOfYear,
} from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortAmount = (amount: number) => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const formatted =
    absAmount < 1e3 ? absAmount.toFixed(2) : (absAmount / 1e3).toFixed(1) + "K";

  return isNegative ? `-${formatted}` : formatted;
};

export function capitalize(value: string) {
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

export const getDateRange = (
  period: "month" | "year",
  year: number,
  month: number,
) => {
  let from: Date;
  let to: Date;

  switch (period) {
    case "month":
      from = startOfMonth(new Date(year, month, 1));
      to = endOfMonth(new Date(year, month, 1));
      break;
    case "year":
      from = startOfYear(new Date(year, 0, 1));
      to = endOfYear(new Date(year, 0, 1));
      break;
  }

  return {
    dateFrom: formatDate(from, "yyyy-MM-dd"),
    dateTo: formatDate(to, "yyyy-MM-dd"),
  };
};
