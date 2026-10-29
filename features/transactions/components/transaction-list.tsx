"use client";
import type { TransactionWithRecurringCategory } from "@/drizzle/schema";
import { TransactionCard } from "@/features/transactions/components/transaction-card";

export default function TransactionList({
	transactions,
}: {
	transactions: TransactionWithRecurringCategory[];
}) {
	return (
		<div>
			{transactions.length > 0 && (
				<div className="text-muted-foreground mb-2 w-fit">{transactions.length} transactions</div>
			)}

			<div className="flex flex-col gap-y-2">
				{transactions.map((transaction) => (
					<TransactionCard key={transaction.id} transaction={transaction} />
				))}
			</div>
		</div>
	);
}
