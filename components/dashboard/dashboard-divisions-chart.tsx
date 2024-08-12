"use client";
import React from "react";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

import { colors } from "@/app/dashboard/year/transaction-type-chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export type DivisionTotal = {
  month: number;
  year: number;
  division: string;
  total: number;
};

const DashboardDivisionsChart = ({
  divisions,
}: {
  divisions: DivisionTotal[];
}) => {
  const data = divisions.map((transaction) => ({
    ...transaction,
    total: transaction.total / 100,
  }));

  return (
    <div>
      <ChartContainer config={{}} className="h-[175px] w-full">
        <BarChart accessibilityLayer data={data}>
          <ChartTooltip
            content={<ChartTooltipContent hideIndicator={true} />}
          />

          <YAxis
            dataKey="total"
            axisLine={false}
            tickMargin={5}
            tickLine={false}
          />

          <XAxis
            dataKey="division"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />

          <Bar dataKey="total" fill="var(--color-name" radius={4}>
            {data.map((entry, index) => (
              <Cell
                cursor="pointer"
                fill={colors[entry.division]}
                key={`cell-${index}`}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default DashboardDivisionsChart;
