"use client";
import { TransactionCard } from "@/components/transactions/components/transaction-card";
import { TransactionWithRecurring } from "@/types";

export default function TransactionList({
  transactions,
}: {
  transactions: TransactionWithRecurring[];
}) {
  return (
    <div>
      {transactions.length > 0 && (
        <div className="text-muted-foreground mb-2">
          {transactions.length} transactions
        </div>
      )}

      <div className="flex flex-col gap-y-4">
        {transactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}
