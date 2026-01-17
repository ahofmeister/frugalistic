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
  fixed,
}: {
  amount: number;
  type: TransactionTypeWithLeftover;
  total?: number;
  label?: string;
  ofLabel?: string;
  fixed?: number;
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

              {fixed && (
                <span className={"flex"}>
                  <span className="text-xs text-muted-foreground mt-1">
                    Fixed: {formatAmount(fixed)} (
                    {Math.round((fixed / amount) * 100)}
                    %)
                  </span>
                </span>
              )}
            </span>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
export default DashboardCard;
