"use client";
import React from "react";
import { Cell, Pie, PieChart } from "recharts";

import { colors } from "@/app/dashboard/statistic/transaction-type-chart";
import CategoryColor from "@/components/categories/category-color";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/components/ui/utils";
import { TransactionWithCategory } from "@/types";

export type DivisionTotal = {
  division: string;
  total: number;
};

const DashboardDivisions = ({
  transactions,
}: {
  transactions: TransactionWithCategory[];
}) => {
  const data: DivisionTotal[] = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => {
      const division = transaction.category?.division;
      if (division) {
        const existing = acc.find((item) => item.division === division);
        if (existing) {
          existing.total += transaction.amount / 100;
        } else {
          acc.push({ division, total: transaction.amount / 100 });
        }
      }
      return acc;
    }, [] as DivisionTotal[]);

  const totalExpense =
    React.useMemo(() => {
      return data?.reduce((acc, curr) => acc + curr.total, 0);
    }, [data]) ?? 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle>Expenses by Division</CardTitle>
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
                    fill={colors[data[index].division]}
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
              key={category.division}
              className={cn({
                ["flex items-center justify-between"]: true,
                ["border-b"]: index + 1 !== data.length,
              })}
            >
              <div className="flex items-center space-x-2">
                <CategoryColor color={colors[data[index].division]} />
                <div className="py-2">{category.division}</div>
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

export default DashboardDivisions;
