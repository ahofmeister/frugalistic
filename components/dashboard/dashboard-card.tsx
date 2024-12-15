import React from "react";

import TransactionAmount from "@/components/transactions/components/transaction-amount";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { TransactionType } from "@/types";

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
  type?: TransactionType | undefined;
  total?: number;
  label?: string;
  ofLabel?: string;
}) => {
  return (
    <Card className="lg:w-[180px] size-36">
      <CardHeader className="text-xl">
        <div className="text-2xl">
          <TransactionAmount amount={amount} type={type} />
        </div>
      </CardHeader>
      <CardContent>{headline}</CardContent>
      <CardFooter>
        <div className="text-sm text-gray-400">
          {total && (
            <>{`${((amount / total) * 100).toFixed(0)}% of ${ofLabel}`}</>
          )}
          {label}
        </div>
      </CardFooter>
    </Card>
  );
};
export default DashboardCard;
