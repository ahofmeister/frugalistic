import React from "react";

import TransactionAmount from "@/components/transactions/components/transaction-amount";
import { Card, CardHeader } from "@/components/ui/card";
import { Division, TransactionType } from "@/types";

const DashboardCard = ({
  headline,
  amount,
  type,
  total,
  label,
  ofLabel,
}: {
  headline: string;
  amount: number;
  type?: TransactionType | Division | undefined;
  total?: number;
  label?: string;
  ofLabel?: string;
}) => {
  return (
    <Card className="lg:w-[180px] w-36 h-36">
      <CardHeader className="text-xl">
        {headline}
        <div className="text-2xl">
          <TransactionAmount amount={amount} type={type} />
        </div>
        <div className="text-sm text-gray-400">
          {total && (
            <>{`${((amount / total) * 100).toFixed(0)}% of ${ofLabel}`}</>
          )}
          {label}
        </div>
      </CardHeader>
    </Card>
  );
};
export default DashboardCard;
