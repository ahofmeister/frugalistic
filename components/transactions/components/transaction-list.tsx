"use client";
import { TransactionCard } from "@/components/transactions/components/transaction-card";
import { TransactionWithRecurring } from "@/types";

export default function TransactionList({
  transactions,
  dateFormat,
}: {
  transactions: TransactionWithRecurring[];
  dateFormat: string;
}) {
  return (
    <div>
      {transactions.length > 0 && (
        <div className="text-muted-foreground mb-2 w-fit">
          {transactions.length} transactions
        </div>
      )}

      <div className="flex flex-col gap-y-2">
        {transactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            dateFormat={dateFormat}
          />
        ))}
      </div>
    </div>
  );
}
