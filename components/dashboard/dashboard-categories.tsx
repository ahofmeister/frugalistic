import React from "react";

import { CategoriesExpensesChart } from "@/components/dashboard/categories-expenses-chart";
import { Period } from "@/components/dashboard/period-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionWithCategory } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { getPeriodDates } from "@/utils/transaction/dates";

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

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Expenses Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoriesExpensesChart expenses={expenses ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
