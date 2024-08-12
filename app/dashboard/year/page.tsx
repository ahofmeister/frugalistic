import { redirect } from "next/navigation";
import React from "react";

import TransactionTypeChart from "@/app/dashboard/year/transaction-type-chart";
import {
  getTotalByCategory,
  getTransactionsTotal,
} from "@/components/transactions/transactions-api";
import { createClient } from "@/utils/supabase/server";

import TransactionByCategoryChart from "./transaction-by-category-chart";

export default async function Year() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) {
    return redirect("/login");
  }

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
      <TransactionByCategoryChart data={transactionsByCategory} />
    </div>
  );
}
