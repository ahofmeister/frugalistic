import React from "react";

import TransactionAmount from "@/components/transactions/components/transaction-amount";
import { Card, CardHeader } from "@/components/ui/card";
import { TransactionType } from "@/types";

const DashboardCard = ({
  label,
  amount,
  type,
  total,
}: {
  label: string;
  amount: number;
  type?: TransactionType | undefined;
  total?: number;
}) => {
  return (
    <Card>
      <CardHeader className="w-48">
        {label}
        <div className="text-2xl">
          <TransactionAmount amount={amount} type={type} />
        </div>
        {total && (
          <div className="text-sm text-gray-400">
            {`${((amount / total) * 100).toFixed(0)}% of net income`}
          </div>
        )}
      </CardHeader>
    </Card>
  );
};
export default DashboardCard;
