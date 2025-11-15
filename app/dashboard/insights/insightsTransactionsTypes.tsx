import { getDateRange, loadYearSearchParam } from "@/lib/utils";
import { TransactionWithCategory } from "@/types";
import { TransactionsChart } from "@/app/dashboard/insights/transactions-chart";
import React from "react";
import { createClient } from "@/utils/supabase/server";
import { SearchParams } from "nuqs/server";

export async function InsightsTransactionsTypes({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();

  const { year } = await loadYearSearchParam(searchParams);

  const { data: transactions = [] } = await supabase
    .from("transactions")
    .select("*, category(*)")
    .gte("datetime", getDateRange("year", year, 1).dateFrom)
    .lte("datetime", getDateRange("year", year, 1).dateTo)
    .returns<TransactionWithCategory[]>();

  return <TransactionsChart transactions={transactions ?? []} />;
}
