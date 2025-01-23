import React from "react";

import { TransactionWithRecurring } from "@/types";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardTransactions(props: {
  month: number;
  year: number;
}) {
  const supabase = await createClient();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, category(*), recurring_transaction(*)")
    // .gte("datetime", props.startDate)
    // .lte("datetime", props.endDate)
    .order("datetime", { ascending: false })
    .order("created_at", { ascending: false })
    .returns<TransactionWithRecurring[]>();

  // return <TransactionList transactions={transactions ?? []} />;
  return (
    <>
      {props.year} - {props.month}
    </>
  );
}
