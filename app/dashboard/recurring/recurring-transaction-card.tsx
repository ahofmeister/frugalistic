import Link from "next/link";
import React from "react";

import FormattedDate from "@/app/dashboard/formatted-date";
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
  dateFormat: string;
}) => {
  const transaction = props.transaction;

  return (
    <Link href={`/dashboard/recurring/${transaction.id}`}>
      <Card
        key={transaction.id}
        className="cursor-pointer hover:bg-accent transition-colors"
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
          <CardDescription>
            <FormattedDate
              date={transaction.next_run ?? "-"}
              format={props.dateFormat}
            />
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end"></CardContent>
        <CardFooter className="flex gap-x-4">
          {!transaction.enabled && (
            <Badge variant="destructive">disabled</Badge>
          )}
          <Badge variant="secondary">{transaction.interval}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default RecurringTransactionCard;
