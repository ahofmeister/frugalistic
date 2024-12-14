"use client";
import { formatDate } from "date-fns";
import { useRouter } from "next/navigation";

import CategoryColor from "@/components/categories/category-color";
import TransactionAmount from "@/components/transactions/components/transaction-amount";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransactionWithRecurring } from "@/types";

export function TransactionCard(props: {
  transaction: TransactionWithRecurring;
}) {
  const router = useRouter();
  const transaction = props.transaction;
  return (
    <Card
      className="cursor-pointer"
      key={transaction.id}
      onClick={() =>
        router.push(`/dashboard/transactions/edit/${transaction.id}`)
      }
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div>{transaction.description}</div>
          <TransactionAmount
            amount={transaction.amount}
            type={transaction.type}
          />
        </CardTitle>

        <CardDescription className="flex justify-between ">
          <span>
            {!transaction.category && <>? Uncategorized</>}

            {transaction.category && (
              <>
                <CategoryColor color={transaction.category?.color} />
                {transaction.category?.name ?? "-"}
              </>
            )}
          </span>

          {formatDate(transaction.datetime, "MMM dd, yyyy")}
        </CardDescription>
      </CardHeader>

      <CardFooter>
        {transaction.recurring_transaction && (
          <Badge variant="secondary">
            {transaction.recurring_transaction.interval}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
