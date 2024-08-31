import { redirect } from "next/navigation";
import React from "react";

import ResetQueryParam from "@/app/dashboard/transactions/reset-query-param";
import TransactionFilter from "@/components/transactions/components/transaction-filter";
import TransactionList from "@/components/transactions/components/transaction-list";
import TransactionSearch from "@/components/transactions/transaction-search";
import { searchTransactions } from "@/components/transactions/transactions-api";
import { createClient } from "@/utils/supabase/server";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: { dateFrom: string; dateTo: string; description: string };
}) {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const data = await searchTransactions({
    dateFrom: searchParams.dateFrom,
    dateTo: searchParams.dateTo,
    description: searchParams.description,
  });

  return (
    <>
      <div className="flex gap-10">
        <TransactionSearch />
        <TransactionFilter />
        <ResetQueryParam />
      </div>

      <div className="mt-4">
        <TransactionList transactions={data} />
      </div>
    </>
  );
}
