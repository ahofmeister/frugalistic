import FormattedDate from "@/app/(dashboard)/dashboard/formatted-date";
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
import Link from "next/link";
import { TransactionWithRecurringCategory } from "@/db/migrations/schema";

export function TransactionCard({
  transaction,
  dateFormat,
}: {
  transaction: TransactionWithRecurringCategory;
  dateFormat: string;
}) {
  return (
    <Link href={`/transactions/edit/${transaction.id}`}>
      <Card key={transaction.id}>
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

            <FormattedDate date={transaction.datetime} format={dateFormat} />
          </CardDescription>
        </CardHeader>

        <CardFooter className={"flex gap-x-2"}>
          {transaction.recurring_transaction && (
            <Badge variant="secondary">
              {transaction.recurring_transaction.interval}
            </Badge>
          )}
          {transaction.recurring_transaction && (
            <Badge variant="secondary">{transaction.costType}</Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
