import React from "react";

import { CategoriesExpensesChart } from "@/components/dashboard/categories-expenses-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionWithCategory } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function DashboardCategories(props: {
  startDate: string;
  endDate: string;
}) {
  const supabase = await createClient();
  const { data: expenses } = await supabase
    .from("transactions")
    .select("*, category(*)")
    .gte("datetime", props.startDate)
    .lte("datetime", props.endDate)
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
