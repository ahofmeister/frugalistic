import React from "react";

import TransactionCategoryTable from "@/app/dashboard/statistic/transaction-type/transaction-category-table";
import { getTotalByCategory } from "@/components/transactions/transactions-api";

export default async function CategoryStatistic() {
  const transactionsByCategory = await getTotalByCategory({ year: 2024 });

  return <TransactionCategoryTable data={transactionsByCategory} />;
}
