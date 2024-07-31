import { redirect } from "next/navigation";
import React from "react";

import TransactionByCategoryChart from "@/app/year/transaction-by-category-chart";
import TransactionTypeChart from "@/app/year/transaction-type-chart";
import {
  getTotalByCategory,
  getTransactionsTotal,
} from "@/components/transactions/transactions-api";
import { createClient } from "@/utils/supabase/server";

export default async function Year() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const data = await getTransactionsTotal({ year: 2024 });
  const transactionsByCategory = await getTotalByCategory({ year: 2024 });

  return (
    <div className="gap-4">
      <TransactionTypeChart data={data} year={2024} />
      <TransactionByCategoryChart data={transactionsByCategory} />
    </div>
  );
}
