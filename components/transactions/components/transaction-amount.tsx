import React from "react";

import { cn } from "@/lib/utils";
import { TransactionType } from "@/types";

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
  type?: TransactionType;
  className?: string;
}) => {
  const typeClass = getTextColor(type);

  return <div className={cn(typeClass, className)}>{formatAmount(amount)}</div>;
};

export default TransactionAmount;

export function getTextColor(type: TransactionType | undefined) {
  switch (type) {
    case "savings":
      return "text-savings";
    case "expense":
      return "text-expense";
    case "income":
      return "text-income";
    default:
      return "";
  }
}
