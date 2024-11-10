import React from "react";

import TransactionCategoryChart from "@/app/dashboard/statistic/type/transaction-category-chart";
import { getTotalByCategory } from "@/components/transactions/transactions-api";

export default async function CategoryStatistic() {
  const transactionsByCategory = await getTotalByCategory({ year: 2024 });

  return <TransactionCategoryChart data={transactionsByCategory} />;
}
