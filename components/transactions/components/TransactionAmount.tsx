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
  let typeClass;
  switch (type) {
    case "savings":
      typeClass = "text-savings";
      break;
    case "expense":
      typeClass = "text-expense";
      break;
    case "income":
      typeClass = "text-income";
      break;
    default:
      typeClass = "";
  }

  return <div className={typeClass}>{formatAmount(amount)}</div>;
};

export default TransactionAmount;
