"use client";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import React from "react";
import { Cell, Label, Pie, PieChart } from "recharts";

import CategoryColor from "@/components/categories/category-color";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/components/ui/utils";
import { createClient } from "@/utils/supabase/client";

export type CategoryTotal = {
  total: number;
  category_name: string;
  category_color: string;
};

const DashboardCategories = ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  const { data: transactionsByCategory } = useQuery(
    createClient()
      .rpc("get_total_amount_by_category3", {
        p_year: year,
        p_month: month + 1,
      })
      .select("*")
      .returns<CategoryTotal[]>()
      .order("total", { ascending: false }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  const data = transactionsByCategory?.map((transaction) => ({
    ...transaction,
    total: transaction.total / 100,
  }));

  const totalExpense =
    React.useMemo(() => {
      return data?.reduce((acc, curr) => acc + curr.total, 0);
    }, [data]) ?? 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
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
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalExpense?.toFixed(0)}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
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
