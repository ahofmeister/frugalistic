import React from "react";

import TransactionTypeChart from "@/app/dashboard/statistic/category/transaction-type-chart";
import { getTransactionsTotal } from "@/components/transactions/transactions-api";

export default async function TypeStatistic() {
  const transactionTotals = await getTransactionsTotal({
    year: new Date().getFullYear(),
  });

  return (
    <TransactionTypeChart
      transactionTotals={transactionTotals}
      year={new Date().getFullYear()}
    />
  );
}
