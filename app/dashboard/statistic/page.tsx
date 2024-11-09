import React from "react";

import TransactionTypeChart from "@/app/dashboard/statistic/transaction-type-chart";
import {
  getTotalByCategory,
  getTransactionsTotal,
} from "@/components/transactions/transactions-api";

import TransactionCategoryChart from "./transaction-category-chart";

export default async function Year() {
  const transactionTotals = await getTransactionsTotal({
    year: new Date().getFullYear(),
  });
  const transactionsByCategory = await getTotalByCategory({ year: 2024 });

  return (
    <div className="gap-4">
      <TransactionTypeChart
        transactionTotals={transactionTotals}
        year={new Date().getFullYear()}
      />
      <TransactionCategoryChart data={transactionsByCategory} />
    </div>
  );
}
