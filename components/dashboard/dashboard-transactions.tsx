import React from "react";

import TransactionList from "@/components/transactions/components/transaction-list";
import { TransactionWithCategory } from "@/types";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardTransactions(props: {
  startDate: string;
  endDate: string;
}) {
  const supabase = await createClient("transactions", true);

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, category(*)")
    .gte("datetime", props.startDate)
    .lte("datetime", props.endDate)
    .returns<TransactionWithCategory[]>();

  return <TransactionList transactions={transactions ?? []} />;
}
