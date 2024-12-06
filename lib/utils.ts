import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatAmount = (amount: number) => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const formatted =
    absAmount < 1e3 ? absAmount.toFixed(2) : (absAmount / 1e3).toFixed(1) + "K";

  return isNegative ? `-${formatted}` : formatted;
};

export function capitalize(value: string) {
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}
