import { format } from "date-fns";
import { FileUpIcon, PencilIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import FormattedDate from "@/app/(dashboard)/dashboard/formatted-date";
import type { settingSchema, TransactionWithRecurringCategory } from "@/drizzle/schema";
import CategoryColor from "@/features/categories/category-color";
import TransactionAmount from "@/features/transactions/components/transaction-amount";
import { Badge } from "@/features/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/features/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/features/ui/tooltip";

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
		<IndicatorTooltip icon={<PencilIcon size={10} />} text="Added manually" />
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
export function TransactionCard({
	transaction,
	settings,
}: {
	transaction: TransactionWithRecurringCategory;
	settings: typeof settingSchema.$inferSelect;
}) {
	return (
		<Link href={`/transactions/edit/${transaction.id}`}>
			<Card key={transaction.id}>
				<CardHeader>
					<CardTitle className="flex justify-between">
						<div className="flex gap-x-1.5 items-center">
							<div>{transaction.description}</div>
							<ImportIndicator settings={settings} importedAt={transaction.importedAt} />
						</div>
						<TransactionAmount amount={transaction.amount} type={transaction.type} />
					</CardTitle>

					<CardDescription className="flex justify-between ">
						<span>
							{transaction.category && (
								<>
									<CategoryColor color={transaction.category.color} />
									{transaction.category.name}
								</>
							)}
						</span>

						<FormattedDate date={transaction.datetime} format={settings.dateFormat} />
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
