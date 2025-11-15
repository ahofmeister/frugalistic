import React from "react";

import { DashboardCategoryCard } from "@/components/dashboard/dashboard-category-card";
import { Transaction, TransactionWithCategory } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { getPeriodDates } from "@/utils/transaction/dates";
import { DashboardParams } from "@/app/dashboard/page";
import { loadSearchParams } from "@/app/dashboard/search-params";

interface CategoryData {
  category: string;
  amount: number;
  fill: string;
}

export async function DashboardCategories({
  searchParams,
}: {
  searchParams: Promise<DashboardParams>;
}) {
  const awaitedParams = await loadSearchParams(searchParams);

  const { startDate, endDate } = getPeriodDates(
    awaitedParams.year,
    awaitedParams.month,
    awaitedParams.period,
  );
  const supabase = await createClient();
  const { data: expenses } = await supabase
    .from("transactions")
    .select("*, category(*)")
    .gte("datetime", startDate)
    .lte("datetime", endDate)
    .eq("type", "expense")
    .order("datetime", { ascending: false })
    .order("created_at", { ascending: false })
    .returns<TransactionWithCategory[]>();

  const categories = expenses
    ?.filter((transaction: Transaction) => transaction.category)
    .reduce<Record<string, CategoryData>>((acc, transaction) => {
      const { name, color } = transaction.category;
      const amount = transaction.amount;

      if (!acc[name]) {
        acc[name] = { category: name, amount: 0, fill: color };
      }

      acc[name].amount += amount;

      return acc;
    }, {});

  const groupedCategories = Object.values(categories ?? []).sort(
    (a, b) => b.amount - a.amount,
  );
  const total = expenses?.reduce((acc, expense) => acc + expense.amount, 0);

  if (expenses?.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="text-lg my-2">Categories</div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {groupedCategories?.map((expense) => (
          <DashboardCategoryCard
            key={expense.category}
            category={expense.category}
            amount={expense.amount}
            fill={expense.fill}
            year={awaitedParams.year}
            month={awaitedParams.month}
            total={total ?? 0}
            period={awaitedParams.period}
          />
        ))}
      </div>
    </div>
  );
}
