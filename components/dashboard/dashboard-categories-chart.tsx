"use client";
import React from "react";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

import { TransactionTotalByMonth } from "@/components/transactions/transactions-api";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const DashboardCategoriesChart = ({
  data,
}: {
  data: TransactionTotalByMonth[];
}) => {
  return (
    <ChartContainer config={{}} className="h-[175px]">
      <BarChart accessibilityLayer data={data}>
        <ChartTooltip content={<ChartTooltipContent hideIndicator={true} />} />
        <YAxis
          dataKey="total"
          axisLine={false}
          tickMargin={5}
          tickLine={false}
        />
        n
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: string) => `${value.slice(0, 3)}.`}
        />
        <Bar dataKey="total" fill="var(--color-name" radius={4}>
          {data.map((entry, index) => (
            <Cell
              cursor="pointer"
              fill={data[index].color}
              key={`cell-${index}`}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export default DashboardCategoriesChart;
