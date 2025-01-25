import React from "react";

import { Period } from "@/components/dashboard/period-selector";
import TransactionList from "@/components/transactions/components/transaction-list";
import { TransactionWithRecurring } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { getPeriodDates } from "@/utils/transaction/dates";

export default async function DashboardTransactions(props: {
  month: number;
  year: number;
  period: Period;
}) {
  const supabase = await createClient();

  const { startDate, endDate } = getPeriodDates(
    props.year,
    props.month,
    props.period,
  );
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, category(*), recurring_transaction(*)")
    .gte("datetime", startDate)
    .lte("datetime", endDate)
    .order("datetime", { ascending: false })
    .order("created_at", { ascending: false })
    .returns<TransactionWithRecurring[]>();

  return <TransactionList transactions={transactions ?? []} />;
}
