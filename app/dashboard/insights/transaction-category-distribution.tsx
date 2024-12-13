"use client";
import { format } from "date-fns";
import React from "react";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { Props } from "recharts/types/component/DefaultLegendContent";

import TransactionAmount from "@/components/transactions/components/transaction-amount";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { shortAmount } from "@/lib/utils";
import { TransactionWithCategory } from "@/types";

interface MonthCategoryTotals {
  month: number;
  total: number;

  [category: string]: number;
}

const transformData = (
  transactions: TransactionWithCategory[],
): MonthCategoryTotals[] => {
  const monthlyTotals: Record<number, MonthCategoryTotals> = {};

  transactions.forEach(({ datetime, category, amount }) => {
    const month = new Date(datetime).getMonth();

    if (!monthlyTotals[month]) {
      monthlyTotals[month] = { month, total: 0 };
    }

    if (category.name) {
      if (!monthlyTotals[month][category.name]) {
        monthlyTotals[month][category.name] = 0;
      }
      monthlyTotals[month][category.name] += amount / 100;
    }

    monthlyTotals[month].total += amount / 100;
  });

  return Object.values(monthlyTotals);
};

const onlyUnique = (value: string, index: number, array: string[]) =>
  array.indexOf(value) === index;

const TransactionCategoryDistribution = ({
  transactions,
}: {
  transactions: TransactionWithCategory[];
}) => {
  const names = transactions
    .map((transaction) => transaction.category.name)
    .filter((name): name is string => name !== null)
    .filter(onlyUnique);

  const colors = transactions
    .map((transaction) => transaction.category.color)
    .filter((color): color is string => color !== null)
    .filter(onlyUnique);

  const dataTransformed = transformData(transactions);
  const renderLegend = (props: Props) => {
    return (
      <div className="flex gap-5 justify-center">
        {props.payload?.map((entry, index) => {
          const color: string = (entry.color as string).substring(0, 7);
          return (
            <div
              className="flex items-center gap-x-2"
              style={{ color: color }}
              key={`item-${index}`}
            >
              <div className="w-2 h-2" style={{ backgroundColor: color }}>
                &nbsp;
              </div>
              {entry.value}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-center font-bold text-xl">
        Category Insights
      </div>
      <ChartContainer config={{}} className="max-h-[400px] w-full">
        <BarChart
          data={dataTransformed}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis
            stroke="transparent"
            dataKey="month"
            tickFormatter={(value) =>
              format(new Date(2024, value as number, 1), "LLL")
            }
          />
          <YAxis
            stroke="transparent"
            tickFormatter={(value: number) => shortAmount(value)}
          />
          <ChartLegend content={renderLegend} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, name) => (
                  <div className="flex min-w-[130px] items-center text-xs text-muted-foreground">
                    <span>{name}</span>
                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                      <TransactionAmount amount={Number(value) * 100} />
                    </div>
                  </div>
                )}
              />
            }
            cursor={false}
          />

          {names.map((name, index) => (
            <Bar
              key={index}
              dataKey={name}
              stackId="a"
              stroke={colors[index]}
              fill={colors[index] + "30"}
            >
              {index === names.length - 1 && (
                <LabelList
                  position="top"
                  valueAccessor={(entry: MonthCategoryTotals) => {
                    return shortAmount(entry.total);
                  }}
                />
              )}
            </Bar>
          ))}
        </BarChart>
      </ChartContainer>
    </>
  );
};

export default TransactionCategoryDistribution;
