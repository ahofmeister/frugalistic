"use client";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import React from "react";

import DashboardCard from "@/components/dashboard-card";
import { TransactionTotal } from "@/components/transactions/transactions-api";
import { createClient } from "@/utils/supabase/client";

const DashboardCards = ({ month, year }: { month: number; year: number }) => {
  const { data: transactionTotal, isLoading } = useQuery(
    createClient()
      .rpc("transaction_type_total5", { year: year })
      .select()
      .returns<TransactionTotal[]>()
      .order("month"),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  const income = transactionTotal ? transactionTotal[month]?.income : 0;
  const expense = transactionTotal ? transactionTotal[month]?.expense : 0;
  const savings = transactionTotal ? transactionTotal[month]?.savings : 0;
  const leftover = income - expense - savings;

  return (
    <div className="grid grid-cols-2 max-w-fit  gap-10">
      <DashboardCard amount={leftover} label="Leftover" total={income} />
      <DashboardCard amount={income} type="income" label="Income" />

      <DashboardCard
        amount={savings}
        type="savings"
        label="Savings"
        total={income}
      />
      <DashboardCard
        amount={expense}
        type="expense"
        label="Expenses"
        total={income}
      />
    </div>
  );
};

export default DashboardCards;
