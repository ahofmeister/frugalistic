import React from "react";
import TransactionList from "@/components/transactions/components/transaction-list";
import { TransactionWithRecurring } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { getPeriodDates } from "@/utils/transaction/dates";
import { loadSearchParams } from "@/app/dashboard/search-params";
import { DashboardParams } from "@/app/dashboard/page";
import { getSettings } from "@/app/dashboard/settings/settings-actions";

export default async function DashboardTransactions({
  searchParams,
}: {
  searchParams: Promise<DashboardParams>;
}) {
  const supabase = await createClient();

  const awaitedParams = await loadSearchParams(searchParams);

  const { startDate, endDate } = getPeriodDates(
    awaitedParams.year,
    awaitedParams.month,
    awaitedParams.period,
  );
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, category(*), recurring_transaction(*)")
    .gte("datetime", startDate)
    .lte("datetime", endDate)
    .order("datetime", { ascending: false })
    .order("created_at", { ascending: false })
    .returns<TransactionWithRecurring[]>();

  const settings = await getSettings();

  return (
    <TransactionList
      transactions={transactions ?? []}
      dateFormat={settings.date_format}
    />
  );
}
