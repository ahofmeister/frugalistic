"use client";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import React from "react";

import DashboardCard from "@/components/dashboard-card";
import { TransactionTotal } from "@/components/transactions/transactions-api";
import { createClient } from "@/utils/supabase/client";

const DashboardCards = ({ month, year }: { month: number; year: number }) => {
  const { data: transactionTotal } = useQuery(
    createClient()
      .rpc("transaction_type_total", { year: year })
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
    <div className="h-80 flex  gap-y-5 flex-col justify-between">
      <div className=" flex gap-5">
        <DashboardCard amount={leftover} label="Leftover" total={income} />
        <DashboardCard amount={income} type="income" label="Income" />
      </div>

      <div className="flex gap-5">
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
    </div>
  );
};

export default DashboardCards;
