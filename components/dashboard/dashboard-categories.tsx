"use client";
import React from "react";
import { Cell, Pie, PieChart } from "recharts";

import CategoryColor from "@/components/categories/category-color";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/components/ui/utils";
import { TransactionWithCategory } from "@/types";

export type CategoryTotal = {
  total: number;
  category_name: string;
  category_color: string;
};

const DashboardCategories = ({
  transactions,
}: {
  transactions: TransactionWithCategory[];
}) => {
  const data = groupTransactionsByCategory(
    transactions.filter((transaction) => transaction.type === "expense"),
  );

  const totalExpense =
    React.useMemo(() => {
      return data?.reduce((acc, curr) => acc + curr.total, 0);
    }, [data]) ?? 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center">
        <div className="flex-1 pb-0">
          <ChartContainer
            config={{}}
            className="mx-auto aspect-square max-h-[250px] min-w-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="total"
                nameKey="category_name"
                innerRadius={91}
              >
                {data?.map((_, index) => (
                  <Cell
                    cursor="pointer"
                    fill={data[index].category_color}
                    key={`cell-${index}`}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
        <div className="h-60 overflow-auto">
          {data?.map((category, index) => (
            <div
              key={category.category_name}
              className={cn({
                ["flex items-center justify-between"]: true,
                ["border-b"]: index + 1 !== data.length,
              })}
            >
              <div className="flex items-center space-x-2">
                <CategoryColor color={category.category_color} />
                <div className="py-2">{category.category_name}</div>
              </div>
              <div className="py-2 w-16 text-right">
                {((category.total / totalExpense) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
export default DashboardCategories;

export function groupTransactionsByCategory(
  transactions: TransactionWithCategory[],
): CategoryTotal[] {
  const categoryTotals: Record<string, CategoryTotal> = {};

  transactions.forEach((transaction) => {
    if (!transaction.category) return;

    const { name, color } = transaction.category;

    if (!categoryTotals[name]) {
      categoryTotals[name] = {
        total: 0,
        category_name: name,
        category_color: color,
      };
    }

    categoryTotals[name].total += transaction.amount / 100;
  });

  return Object.values(categoryTotals).sort((b, a) => a.total - b.total);
}
