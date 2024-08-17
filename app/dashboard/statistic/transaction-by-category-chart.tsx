"use client";
import { format } from "date-fns";
import React from "react";
import {
  Bar,
  BarChart,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import TransactionAmount, {
  formatAmount,
} from "@/components/transactions/components/TransactionAmount";
import { TransactionTotalByMonth } from "@/components/transactions/transactions-api";

interface TransactionTotalByMonth2 {
  name: string | null;
  color: string | null;
  month: number;
  total: number;
}

interface MonthCategoryTotals {
  month: number;
  total: number;

  [category: string]: number;
}

const transformData = (
  data: TransactionTotalByMonth2[],
): MonthCategoryTotals[] => {
  const monthlyTotals: Record<number, MonthCategoryTotals> = {};

  data.forEach(({ month, name, total }) => {
    if (!monthlyTotals[month]) {
      monthlyTotals[month] = { month, total: 0 };
    }

    if (name !== null) {
      if (!monthlyTotals[month][name]) {
        monthlyTotals[month][name] = 0;
      }
      monthlyTotals[month][name] += total;
    }
  });

  return Object.values(monthlyTotals);
};

function onlyUnique(value: string, index: number, array: string[]) {
  return array.indexOf(value) === index;
}

const TransactionByCategoryChart = ({
  data,
}: {
  data: TransactionTotalByMonth[];
}) => {
  const names = data.map((transaction) => transaction.name).filter(onlyUnique);
  const colors = data
    .map((transaction) => transaction.color)
    .filter(onlyUnique);

  let tooltip: string;
  const CustomTooltip = ({ payload }: TooltipProps<ValueType, NameType>) => {
    if (!payload || !tooltip) {
      return null;
    }

    for (const bar of payload) {
      if (bar.dataKey === tooltip) {
        return (
          <div>
            {bar.name}: <TransactionAmount amount={bar.value as number} />
          </div>
        );
      }
    }

    return null;
  };

  const dataTransformed = transformData(data);

  return (
    <ResponsiveContainer width={1200} height={400}>
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
          dataKey="month"
          tickFormatter={(value) => format(new Date(2024, value - 1, 1), "LLL")}
        />
        <YAxis tickFormatter={(value: number) => formatAmount(value)} />
        <Legend />
        <Tooltip
          cursor={{ fill: "#121212" }}
          content={({ active, payload }) => (
            <CustomTooltip active={active} payload={payload} />
          )}
        />

        {names.map((name, index) => (
          <Bar
            key={index}
            dataKey={name}
            stackId="a"
            fill={colors[index]}
            onMouseOver={() => (tooltip = name)}
          >
            {index === names.length - 1 && (
              <LabelList
                position="top"
                valueAccessor={(entry: MonthCategoryTotals) => {
                  return formatAmount(calculateMonthlyTotal(data, entry.month));
                }}
              />
            )}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

function calculateMonthlyTotal(data: TransactionTotalByMonth[], month: number) {
  let total = 0;

  data.forEach((item) => {
    if (item.name === null || item.color === null) {
      return;
    }

    if (item.month === month) {
      total += item.total;
    }
  });

  return total;
}

export default TransactionByCategoryChart;
