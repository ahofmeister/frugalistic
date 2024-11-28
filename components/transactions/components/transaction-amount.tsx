import React from "react";

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
}: {
  amount: number;
  type?: TransactionType;
}) => {
  const typeClass = extracted(type);

  return <div className={typeClass}>{formatAmount(amount)}</div>;
};

export default TransactionAmount;

export function extracted(type: TransactionType | undefined) {
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
