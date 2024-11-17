import React from "react";

import TransactionTypeTable from "@/app/dashboard/statistic/expenses-category/transaction-type-table";
import { getTransactionsTotal } from "@/components/transactions/transactions-api";

export default async function TypeStatistic() {
  const year = new Date().getFullYear();
  const transactionTotals = await getTransactionsTotal({
    year: year,
  });

  return (
    <TransactionTypeTable transactionTotals={transactionTotals} year={year} />
  );
}
