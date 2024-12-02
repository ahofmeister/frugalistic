import React from "react";

import { Division, TransactionType } from "@/types";

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
  type?: TransactionType | Division;
}) => {
  const typeClass = getColor(type);

  return <div className={typeClass}>{formatAmount(amount)}</div>;
};

export default TransactionAmount;

export function getColor(type: TransactionType | Division | undefined) {
  switch (type) {
    case "savings":
      return "text-savings";
    case "expense":
      return "text-expense";
    case "income":
      return "text-income";
    case "leisure":
      return "text-leisure";
    case "essentials":
      return "text-essential";
    default:
      return "";
  }
}
