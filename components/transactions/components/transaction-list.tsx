"use client";
import { TransactionCard } from "@/components/transactions/components/transaction-card";
import type { TransactionWithRecurringCategory } from "@/db/migrations/schema";

export default function TransactionList({
	transactions,
	dateFormat,
}: {
	transactions: TransactionWithRecurringCategory[];
	dateFormat: string;
}) {
	return (
		<div>
			{transactions.length > 0 && (
				<div className="text-muted-foreground mb-2 w-fit">{transactions.length} transactions</div>
			)}

			<div className="flex flex-col gap-y-2">
				{transactions.map((transaction) => (
					<TransactionCard key={transaction.id} transaction={transaction} dateFormat={dateFormat} />
				))}
			</div>
		</div>
	);
}
