"use client";
import { format } from "date-fns";
import React, { useState } from "react";
import { Area, AreaChart, XAxis, YAxis } from "recharts";

import TransactionAmount from "@/components/transactions/components/transaction-amount";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formatAmount } from "@/lib/utils";
import { Transaction, TransactionType } from "@/types";
import { transactionColors } from "@/utils/transaction/colors";

export function TransactionsChart(props: { transactions: Transaction[] }) {
  const [activeTypes, setActiveTypes] = useState<TransactionType[]>([
    "income",
    "expense",
    "savings",
  ]);

  const filteredTransactions = props.transactions.filter((t) =>
    activeTypes.includes(t.type),
  );

  const groupedByMonth = filteredTransactions.reduce(
    (acc: Record<string, Record<TransactionType, number>>, transaction) => {
      const month = new Date(transaction.datetime).getMonth().toString();
      if (!acc[month]) {
        acc[month] = { income: 0, expense: 0, savings: 0 };
      }
      acc[month][transaction.type] += transaction.amount;
      return acc;
    },
    {},
  );

  const chartData = Array.from({ length: 12 }, (_, index) => {
    const monthData = groupedByMonth[index.toString()] || {
      income: 0,
      expense: 0,
      savings: 0,
    };
    return {
      name: format(new Date(2024, index), "MMM"),
      income: monthData.income / 100,
      expense: monthData.expense / 100,
      savings: monthData.savings / 100,
    };
  });

  return (
    <>
      <ToggleGroup
        className="justify-start"
        size="sm"
        defaultValue={activeTypes}
        type="multiple"
        onValueChange={(value) => setActiveTypes(value as TransactionType[])}
      >
        <ToggleGroupItem value="income">Income</ToggleGroupItem>
        <ToggleGroupItem value="expense">Expense</ToggleGroupItem>
        <ToggleGroupItem value="savings">Savings</ToggleGroupItem>
      </ToggleGroup>

      <div className="overflow-x-scroll mt-3">
        <ChartContainer config={{}} className="max-h-[200px] w-full">
          <AreaChart data={chartData}>
            <XAxis dataKey="name" stroke="transparent" />
            <YAxis
              stroke="transparent"
              tickFormatter={(value: string) => formatAmount(Number(value))}
            />
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
            {activeTypes.map((type) => (
              <Area
                key={type}
                type="monotone"
                dataKey={type}
                stroke={transactionColors[type]}
                fill={transactionColors[type] + "30"}
                isAnimationActive={false}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </div>
    </>
  );
}
