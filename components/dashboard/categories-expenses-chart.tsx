"use client";
import Link from "next/link";
import React from "react";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { shortAmount } from "@/lib/utils";
import { TransactionWithCategory } from "@/types";

interface CategoryData {
  category: string;
  total: number;
  fill: string;
}

export function CategoriesExpensesChart(props: {
  expenses: TransactionWithCategory[];
}) {
  const categories = props.expenses
    .filter((transaction) => transaction.category)
    .reduce<Record<string, CategoryData>>((acc, transaction) => {
      const { name, color } = transaction.category;
      const amount = transaction.amount;

      if (!acc[name]) {
        acc[name] = { category: name, total: 0, fill: color };
      }

      acc[name].total += amount / 100;

      return acc;
    }, {});

  const groupedCategories = Object.values(categories).sort(
    (a, b) => b.total - a.total,
  );

  if (groupedCategories.length === 0) {
    return (
      <div className=" inset-0 gap-y-4 flex flex-col h-[240px] items-center justify-center  text-muted-foreground text-lg">
        No expenses to display yet!
        <Link href="/dashboard/transactions/new">
          <Button variant="default">
            <div className="flex">New Transaction</div>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <ChartContainer
        config={{}}
        className="max-h-[400px] w-full min-h-[200px] h-[240px]"
      >
        <BarChart
          barCategoryGap={5}
          accessibilityLayer
          data={groupedCategories}
          margin={{ top: 15, right: 0, left: 0, bottom: 0 }}
        >
          <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
          <XAxis dataKey="category" tickLine={false} axisLine={false} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={(value: string) => shortAmount(Number(value))}
          />
          <Bar
            dataKey="total"
            fill="var(--color-total)"
            radius={3}
            isAnimationActive={false}
          >
            <LabelList
              formatter={(value: string) => shortAmount(Number(value))}
              position="top"
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
