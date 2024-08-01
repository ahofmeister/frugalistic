"use client";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import React from "react";

import DashboardCategoriesChart from "@/components/dashboard/dashboard-categories-chart";
import { TransactionTotalByMonth } from "@/components/transactions/transactions-api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";

const DashboardCategories = ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  const { data: transactionsByCategory, isLoading } = useQuery(
    createClient()
      .rpc("transaction_categories_total6", { year: year })
      .select("*")
      .returns<TransactionTotalByMonth[]>()
      .order("month")
      .order("total", { ascending: false }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  const data = transactionsByCategory
    ?.filter(
      (transaction) =>
        transaction.name !== null && transaction.month === month + 1,
    )
    .map((transaction) => ({
      ...transaction,
      total: transaction.total / 100,
    }));

  return (
    <Card className="p-4 min-w-[400px]">
      <CardHeader>Categories</CardHeader>
      <CardContent>
        {isLoading && <div>Loading</div>}
        <DashboardCategoriesChart data={data ?? []} />
      </CardContent>
    </Card>
  );
};

export default DashboardCategories;
