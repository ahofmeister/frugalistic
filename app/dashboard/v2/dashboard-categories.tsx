"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatAmount } from "@/lib/utils";
import { TransactionWithCategory } from "@/types";

interface CategoryData {
  category: string;
  total: number;
  fill: string;
}

export function DashboardCategories(props: {
  transactions: TransactionWithCategory[];
}) {
  const expenses = props.transactions.filter(
    (transaction) => transaction.type === "expense",
  );

  const categories = expenses
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

  const chartConfig: ChartConfig = {} as ChartConfig;

  return (
    <div className="w-full">
      <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
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
            tickFormatter={(value: string) => formatAmount(Number(value))}
          />
          <Bar dataKey="total" fill="var(--color-total)" radius={3}>
            <LabelList
              formatter={(value: string) => formatAmount(Number(value))}
              position="top"
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
