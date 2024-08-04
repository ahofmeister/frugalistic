"use client";
import { format } from "date-fns";
import React from "react";
import {
  Legend,
  Line,
  LineChart,
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
import { TransactionTotal } from "@/components/transactions/transactions-api";
import { TransactionType } from "@/types";

export const colors: { [index: string]: string } = {
  income: "#84F5F5",
  savings: "#e9c46a",
  expense: "#F58484",
  leisure: "#6FCF97",
  essentials: "#BEBEBE",
};

export default function TransactionTypeChart({
  transactionTotals,
  year,
}: {
  transactionTotals: TransactionTotal[];
  year: number;
}) {
  return (
    <div className="flex gap-3">
      <LineChart
        width={1200}
        height={400}
        data={transactionTotals}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis
          dataKey="month"
          tickFormatter={(value) => format(new Date(year, value - 1, 1), "LLL")}
        />
        <YAxis tickFormatter={(value: number) => formatAmount(value)} />

        <Tooltip
          cursor={{ fill: "" }}
          content={({ payload }) => {
            return <CustomTooltip payload={payload} />;
          }}
        />
        <Legend />
        {Object.entries(colors).map(([key, value]) => (
          <Line key={key} type="monotone" dataKey={key} stroke={value} />
        ))}
      </LineChart>
    </div>
  );
}

const CustomTooltip = ({ payload }: TooltipProps<ValueType, NameType>) => {
  return (
    <div>
      {payload?.map((line) => {
        if (!line.value) {
          return <></>;
        }
        return (
          <div key={line.name}>
            <TransactionAmount
              amount={line.value as number}
              type={line.name as TransactionType}
            />
          </div>
        );
      })}
    </div>
  );
};
