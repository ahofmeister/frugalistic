import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { FileUpIcon, HandIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import FormattedDate from "@/app/(dashboard)/dashboard/formatted-date";
import type { settingSchema, TransactionWithRecurringCategory } from "@/drizzle/schema";
import BookTransactionButton from "@/features/transactions/components/book-transaction-button";
import CategoryNameColor from "@/features/transactions/components/category-name-color";
import DeclinePlannedTransactionButton from "@/features/transactions/components/decline-planned-transaction-button";
import TransactionAmount from "@/features/transactions/components/transaction-amount";
import { Badge } from "@/features/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/features/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/features/ui/tooltip";
import { cn } from "@/lib/utils";

function IndicatorTooltip({ icon, text }: { icon: ReactNode; text: string }) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<span className="text-muted-foreground">{icon}</span>
				</TooltipTrigger>
				<TooltipContent>{text}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

function ImportIndicator({
	settings,
	importedAt,
}: {
	settings: typeof settingSchema.$inferSelect;
	importedAt: string | null;
}) {
	const importedIndicator = importedAt ? (
		<IndicatorTooltip
			icon={<FileUpIcon size={10} />}
			text={`Imported on ${format(importedAt, settings.dateFormat)}`}
		/>
	) : null;

	const manualIndicator = importedAt ? null : (
		<IndicatorTooltip icon={<HandIcon size={10} />} text="Added manually" />
	);

	switch (settings.importIndicator) {
		case "none":
			return null;
		case "imported":
			return importedIndicator;
		case "manual":
			return manualIndicator;
		case "both":
			return importedIndicator ?? manualIndicator;
	}
}

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
	settings,
}: {
	transaction: TransactionWithRecurringCategory;
	settings: typeof settingSchema.$inferSelect;
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
							<ImportIndicator settings={settings} importedAt={transaction.importedAt} />
							{isPlanned && <PlannedBadge daysUntil={daysUntil} />}
							{isPlanned && <BookTransactionButton transactionId={transaction.id} />}
							{isPlanned && <DeclinePlannedTransactionButton transactionId={transaction.id} />}
						</div>
						<TransactionAmount amount={transaction.amount} type={transaction.type} />
					</CardTitle>

					<CardDescription className="flex justify-between">
						<CategoryNameColor name={category.name} color={category.color} />
						<span>
							<FormattedDate date={transaction.datetime} format={settings.dateFormat} />
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
