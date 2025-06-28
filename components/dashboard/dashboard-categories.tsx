import React from "react";

import { DashboardCategoryCard } from "@/components/dashboard/dashboard-category-card";
import { Period } from "@/components/dashboard/period-selector";
import { Transaction, TransactionWithCategory } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { getPeriodDates } from "@/utils/transaction/dates";

interface CategoryData {
  category: string;
  total: number;
  fill: string;
}

export async function DashboardCategories(props: {
  month: number;
  year: number;
  period: Period;
}) {
  const { startDate, endDate } = getPeriodDates(
    props.year,
    props.month,
    props.period,
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
        acc[name] = { category: name, total: 0, fill: color };
      }

      acc[name].total += amount;

      return acc;
    }, {});

  const groupedCategories = Object.values(categories ?? []).sort(
    (a, b) => b.total - a.total,
  );

  return (
    <div className="w-full">
      <div className="text-lg my-2">Categories</div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {groupedCategories?.map((expense) => (
          <DashboardCategoryCard
            key={expense.category}
            category={expense.category}
            total={expense.total}
            fill={expense.fill}
            year={props.year}
            month={props.month}
          />
        ))}
      </div>
    </div>
  );
}
