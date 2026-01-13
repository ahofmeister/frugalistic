import React from "react";

import TransactionAmount, {
  formatAmount,
  getTextColor,
} from "@/components/transactions/components/transaction-amount";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { capitalize } from "@/lib/utils";
import { TransactionTypeWithLeftover } from "@/types";

const DashboardCard = ({
  amount,
  type,
  total,
  label,
  ofLabel,
  breakdown,
}: {
  amount: number;
  type: TransactionTypeWithLeftover;
  total?: number;
  label?: string;
  ofLabel?: string;
  breakdown?: {
    fixed: number;
    variable: number;
  };
}) => {
  return (
    <Card className={`w-full`}>
      <CardHeader>
        <CardTitle className={getTextColor(type)}>
          {capitalize(type as string)}
        </CardTitle>
        <div className="text-2xl">
          <TransactionAmount amount={amount} type={type} />
        </div>
        <CardDescription>
          {total !== undefined && total > 0 && (
            <span className="text-sm text-gray-400">
              <>{`${((amount / (total || 1)) * 100).toFixed(0)}% of ${ofLabel}`}</>
              {label}
            </span>
          )}
        </CardDescription>
        {breakdown && (
          <div className="text-xs text-muted-foreground mt-1 space-y-0.5 grid grid-cols-2">
            <div>
              Fixed: {formatAmount(breakdown.fixed)} (
              {Math.round((breakdown.fixed / amount) * 100)}%)
            </div>
            <div>
              Variable: {formatAmount(breakdown.variable)} (
              {Math.round((breakdown.variable / amount) * 100)}%)
            </div>
          </div>
        )}
      </CardHeader>
    </Card>
  );
};
export default DashboardCard;
