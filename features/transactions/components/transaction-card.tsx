import { formatDate } from "date-fns";
import { FileUpIcon } from "lucide-react";
import Link from "next/link";
import FormattedDate from "@/app/(dashboard)/dashboard/formatted-date";
import type { TransactionWithRecurringCategory } from "@/drizzle/schema";
import CategoryColor from "@/features/categories/category-color";
import TransactionAmount from "@/features/transactions/components/transaction-amount";
import { Badge } from "@/features/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/features/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/features/ui/tooltip";

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
						<div className="flex gap-x-1.5 items-center">
							<div>{transaction.description}</div>
							{transaction.importedAt && (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger>
											<FileUpIcon size={10} />
										</TooltipTrigger>
										<TooltipContent>
											Imported from {formatDate(transaction.importedAt, dateFormat)}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
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

						<FormattedDate date={transaction.datetime} format={dateFormat} />
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
