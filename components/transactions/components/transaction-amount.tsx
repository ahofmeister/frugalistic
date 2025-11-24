import React from "react";

import { cn } from "@/lib/utils";
import { TransactionTypeWithLeftover } from "@/types";

export const formatAmount = (input: number) => {
  if (input === 0) {
    return "0";
  }

  return (input / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const TransactionAmount = ({
  amount,
  type,
  className,
}: {
  amount: number;
  type?: TransactionTypeWithLeftover;
  className?: string;
}) => {
  const typeClass = getTextColor(type);

  return (
    <span className={cn(typeClass, className)}>{formatAmount(amount)}</span>
  );
};

export default TransactionAmount;

export function getTextColor(type: TransactionTypeWithLeftover | undefined) {
  switch (type) {
    case "savings":
      return "text-savings";
    case "expense":
      return "text-expense";
    case "income":
      return "text-income";
    case "leftover":
      return "text-leftover";
  }
}

export function getBgColor(type: TransactionTypeWithLeftover | undefined) {
  switch (type) {
    case "savings":
      return "bg-savings";
    case "expense":
      return "bg-expense";
    case "income":
      return "bg-income";
    case "leftover":
      return "bg-leftover";
  }
}
