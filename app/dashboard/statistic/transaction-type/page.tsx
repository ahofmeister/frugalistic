import React from "react";

import TransactionTypeChart from "@/app/dashboard/statistic/expenses-category/transaction-type-chart";
import { getTransactionsTotal } from "@/components/transactions/transactions-api";

export default async function TypeStatistic() {
  const year = new Date().getFullYear();
  const transactionTotals = await getTransactionsTotal({
    year: year,
  });

  return (
    <TransactionTypeChart transactionTotals={transactionTotals} year={year} />
  );
}
