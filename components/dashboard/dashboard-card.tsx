import React from "react";

import TransactionAmount from "@/components/transactions/components/transaction-amount";
import { Card, CardHeader } from "@/components/ui/card";
import { TransactionType } from "@/types";

const DashboardCard = ({
  headline,
  amount,
  type,
  total,
  label,
}: {
  headline: string;
  amount: number;
  type?: TransactionType | undefined;
  total?: number;
  label?: string;
}) => {
  return (
    <Card className="lg:w-52 w-36 h-36">
      <CardHeader className="">
        {headline}
        <div className="text-2xl">
          <TransactionAmount amount={amount} type={type} />
        </div>
        <div className="text-sm text-gray-400">
          {total && (
            <>{`${((amount / total) * 100).toFixed(0)}% of net income`}</>
          )}
          {label}
        </div>
      </CardHeader>
    </Card>
  );
};
export default DashboardCard;
