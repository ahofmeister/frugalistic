"use client";
import type { settingSchema, TransactionWithRecurringCategory } from "@/drizzle/schema";
import { TransactionCard } from "@/features/transactions/components/transaction-card";

export default function TransactionList({
	transactions,
	settings,
}: {
	transactions: TransactionWithRecurringCategory[];
	settings: typeof settingSchema.$inferSelect;
}) {
	return (
		<div>
			{transactions.length > 0 && (
				<div className="text-muted-foreground mb-2 w-fit">{transactions.length} transactions</div>
			)}

			<div className="flex flex-col gap-y-2">
				{transactions.map((transaction) => (
					<TransactionCard key={transaction.id} transaction={transaction} settings={settings} />
				))}
			</div>
		</div>
	);
}
