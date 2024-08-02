"use client";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { format, lastDayOfMonth } from "date-fns";
import { useSearchParams } from "next/navigation";
import React from "react";

import TransactionList from "@/components/transactions/components/transaction-list";
import { TransactionWithCategory } from "@/types";
import { createClient } from "@/utils/supabase/client";

export default function DashboardTransactions() {
  const searchParams = useSearchParams();

  const year = Number(searchParams.get("year") ?? new Date().getFullYear());
  const month = Number(searchParams.get("month") ?? new Date().getMonth());

  const { data: transactions } = useQuery(
    createClient()
      .from("transactions")
      .select(
        "id, description, amount, datetime, type, category(name, division)",
      )
      .gte("datetime", format(new Date(year, month, 1), "yyyy-MM-01"))
      .lte(
        "datetime",
        format(lastDayOfMonth(new Date(year, month, 1)), "yyyy-MM-dd"),
      )
      .order("datetime", { ascending: false })
      .returns<TransactionWithCategory[]>(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  return (
    <div>
      <TransactionList transactions={transactions ?? []} />
    </div>
  );
}
