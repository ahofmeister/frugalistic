import React from "react";

import TransactionAmount, {
  getBgColor,
} from "@/components/transactions/components/transaction-amount";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { TransactionType } from "@/types";

const DashboardCard = ({
  amount,
  type,
  total,
  label,
  ofLabel,
}: {
  amount: number;
  type?: TransactionType | undefined;
  total?: number;
  label?: string;
  ofLabel?: string;
}) => {
  return (
    <Card
      className={`lg:w-[180px] size-30 ${getBgColor(type)}`}
      // @ts-expect-error CSS property exists
      style={{ "--tw-bg-opacity": 0.2 }}
    >
      <CardHeader className="text-xl">
        <div className="text-2xl">
          <TransactionAmount amount={amount} type={type} />
        </div>
        <CardDescription>
          <span className="text-sm text-gray-400">
            {total && (
              <>{`${((amount / total) * 100).toFixed(0)}% of ${ofLabel}`}</>
            )}
            {label}
          </span>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
export default DashboardCard;
