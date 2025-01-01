"use client";
import { useRouter } from "next/navigation";
import React from "react";

import TransactionAmount from "@/components/transactions/components/transaction-amount";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecurringTransaction } from "@/types";

const RecurringTransactionCard = (props: {
  transaction: RecurringTransaction;
}) => {
  const transaction = props.transaction;
  const router = useRouter();
  return (
    <Card
      key={transaction.id}
      className="cursor-pointer"
      onClick={() => router.push(`/dashboard/recurring/${transaction.id}`)}
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div>{transaction.description}</div>
          <div>
            <TransactionAmount
              amount={transaction.amount}
              type={transaction.type}
            />
          </div>
        </CardTitle>
        <CardDescription>{transaction.next_run}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-end"></CardContent>
      <CardFooter className="flex gap-x-4">
        {!transaction.enabled && <Badge variant="destructive">disabled</Badge>}
        <Badge variant="secondary">{transaction.interval}</Badge>
      </CardFooter>
    </Card>
  );
};

export default RecurringTransactionCard;
