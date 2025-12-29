import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { count, isNotNull } from "drizzle-orm";
import { transactions } from "@/db/migrations/schema";
import { dbTransaction } from "@/db";

export const NumberTransactions = async () => {
  const [{ count: totalCount }] = await dbTransaction((tx) => {
    return tx.select({ count: count() }).from(transactions);
  });

  const [{ count: recurringCount }] = await dbTransaction((tx) => {
    return tx
      .select({ count: count() })
      .from(transactions)
      .where(isNotNull(transactions.recurringTransaction));
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="text-xl">Transactions</div>
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex flex-col items-start gap-1">
        <div>{totalCount}</div>
        <div className="text-sm text-muted-foreground">
          {recurringCount} from recurring
        </div>
      </CardFooter>
    </Card>
  );
};
