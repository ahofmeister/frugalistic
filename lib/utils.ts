import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatAmount = (amount: number) => {
  return amount < 1e3 ? amount.toFixed(2) : (amount / 1e3).toFixed(1) + "K";
};
