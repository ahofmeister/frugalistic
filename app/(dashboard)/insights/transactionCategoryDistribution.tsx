import TransactionCategoryDistributionChart from "@/app/(dashboard)/insights/transaction-category-distribution-chart";
import React from "react";
import { getDateRange, loadYearSearchParam } from "@/lib/utils";
import { TransactionWithCategory } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { SearchParams } from "nuqs/server";

export async function TransactionCategoryDistribution({
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

  return (
    <TransactionCategoryDistributionChart
      transactions={
        transactions?.filter((transaction) => transaction.type === "expense") ??
        []
      }
    />
  );
}
