"use client";
import { format } from "date-fns";
import React, { useState } from "react";
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
} from "@/components/transactions/components/transaction-amount";
import { TransactionTotal } from "@/components/transactions/transactions-api";
import { Switch } from "@/components/ui/switch";
import { transactionColors } from "@/utils/transaction/colors";

export default function TransactionTypeChart({
  transactionTotals,
  year,
}: {
  transactionTotals: TransactionTotal[];
  year: number;
}) {
  const [showAverage, setShowAverage] = useState(false);
  const [showTotal, setShowTotal] = useState(true);

  const filteredTotals = transactionTotals.filter(
    ({ expense, income, savings }) => expense > 0 && income > 0 && savings > 0,
  );

  const averageExpense =
    filteredTotals.reduce((sum, { expense }) => sum + expense, 0) /
    filteredTotals.length;
  const averageIncome =
    filteredTotals.reduce((sum, { income }) => sum + income, 0) /
    filteredTotals.length;
  const averageSavings =
    filteredTotals.reduce((sum, { savings }) => sum + savings, 0) /
    filteredTotals.length;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <span>Show Total</span>
          <Switch
            checked={showTotal}
            onCheckedChange={(checked) => setShowTotal(checked)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span>Show Average</span>
          <Switch
            checked={showAverage}
            onCheckedChange={(checked) => setShowAverage(checked)}
          />
        </div>
      </div>

      <LineChart
        width={1200}
        height={400}
        data={filteredTotals}
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

        <Legend iconType="plainline" />

        <Tooltip
          cursor={{ fill: "" }}
          content={({ payload }) => {
            return <CustomTooltip payload={payload} />;
          }}
        />

        {showTotal &&
          Object.entries(transactionColors).map(([key, value]) => (
            <Line key={key} type="monotone" dataKey={key} stroke={value} />
          ))}

        {showAverage && (
          <>
            <Line
              type="monotone"
              dataKey={() => averageExpense}
              stroke={transactionColors.expense}
              strokeDasharray="5 5"
              name="average expense"
              legendType="line"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey={() => averageIncome}
              stroke={transactionColors.income}
              strokeDasharray="5 5"
              name="average income"
              legendType="line"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey={() => averageSavings}
              stroke={transactionColors.savings}
              strokeDasharray="5 5"
              name="average savings"
              legendType="line"
              isAnimationActive={false}
            />
          </>
        )}
      </LineChart>
    </div>
  );
}

const CustomTooltip = ({
  payload,
  active,
}: TooltipProps<ValueType, NameType>) => {
  return (
    <div className="border border-primary/20 p-2 bg-black">
      {active && <>sasa</>}

      {payload?.map((line) => {
        if (!line.value) {
          return <></>;
        }
        return (
          <div
            className="flex gap-2"
            style={{ color: line.stroke }}
            key={line.name}
          >
            {line.name}
            {/*{JSON.stringify(payload)}*/}
            <TransactionAmount amount={line.value as number} />
          </div>
        );
      })}
    </div>
  );
};
