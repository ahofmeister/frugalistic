import { differenceInCalendarDays, parseISO } from "date-fns";
import Link from "next/link";
import FormattedDate from "@/app/(dashboard)/dashboard/formatted-date";
import type { TransactionWithRecurringCategory } from "@/drizzle/schema";
import BookTransactionButton from "@/features/transactions/components/book-transaction-button";
import CategoryNameColor from "@/features/transactions/components/category-name-color";
import DeclinePlannedTransactionButton from "@/features/transactions/components/decline-planned-transaction-button";
import DisplayAmount from "@/features/transactions/components/display-amount";
import { TransactionImportedIndicator } from "@/features/transactions/components/transaction-imported-indicator";
import { Badge } from "@/features/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/features/ui/card";
import { cn } from "@/lib/utils";

function PlannedBadge({ daysUntil }: { daysUntil: number }) {
	if (daysUntil <= 0) {
		return (
			<Badge variant="outline" className="border-dashed border-amber-400 text-amber-400">
				Due
			</Badge>
		);
	}

	return (
		<Badge variant="outline" className="border-dashed text-muted-foreground">
			Planned
		</Badge>
	);
}

export function TransactionCard({
	transaction,
}: {
	transaction: TransactionWithRecurringCategory;
}) {
	const category = transaction.category;
	const isPlanned = transaction.status === "planned";
	const daysUntil = differenceInCalendarDays(parseISO(transaction.datetime), new Date());

	return (
		<Link href={`/transactions/edit/${transaction.id}`}>
			<Card
				key={transaction.id}
				className={cn(isPlanned && "border border-dashed border-muted-foreground/40")}
			>
				<CardHeader>
					<CardTitle className="flex justify-between">
						<div className="flex gap-x-1.5 items-center">
							<div>{transaction.description}</div>
							<TransactionImportedIndicator importedAt={transaction.importedAt} />
							{isPlanned && <PlannedBadge daysUntil={daysUntil} />}
							{isPlanned && <BookTransactionButton transactionId={transaction.id} />}
							{isPlanned && <DeclinePlannedTransactionButton transactionId={transaction.id} />}
						</div>
						<DisplayAmount amount={transaction.amount} type={transaction.type} />
					</CardTitle>

					<CardDescription className="flex justify-between">
						<CategoryNameColor name={category.name} color={category.color} />
						<span>
							<FormattedDate date={transaction.datetime} />
							{isPlanned && daysUntil > 0
								? ` · in ${daysUntil} ${daysUntil === 1 ? "day" : "days"}`
								: ""}
						</span>
					</CardDescription>
				</CardHeader>

				<CardFooter className={"flex gap-x-2"}>
					{transaction.recurringTransaction && (
						<Badge variant="secondary">{transaction.recurringTransaction.interval}</Badge>
					)}
					{transaction.recurringTransaction && (
						<Badge variant="secondary">{transaction.costType}</Badge>
					)}
				</CardFooter>
			</Card>
		</Link>
	);
}
