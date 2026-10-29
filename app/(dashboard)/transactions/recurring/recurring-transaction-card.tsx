import Link from "next/link";

import FormattedDate from "@/app/(dashboard)/dashboard/formatted-date";
import type { categories, transactionsRecurring } from "@/drizzle/schema";
import CategoryNameColor from "@/features/transactions/components/category-name-color";
import DisplayAmount from "@/features/transactions/components/display-amount";
import { Badge } from "@/features/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/features/ui/card";

const RecurringTransactionCard = ({
	transaction,
}: {
	transaction: typeof transactionsRecurring.$inferSelect & {
		category: typeof categories.$inferSelect;
	};
}) => {
	const category = transaction.category;

	return (
		<Link href={`/transactions/recurring/${transaction.id}`}>
			<Card>
				<CardHeader>
					<CardTitle className="flex justify-between">
						<div>{transaction.description}</div>
						<div>
							<DisplayAmount amount={transaction.amount} type={transaction.type} />
						</div>
					</CardTitle>
					<CardDescription className="flex justify-between">
						<CategoryNameColor name={category.name} color={category.color} />
						<FormattedDate date={transaction.nextRun ?? "-"} />
					</CardDescription>
				</CardHeader>
				<CardContent className="flex justify-end"></CardContent>
				<CardFooter className="flex gap-x-4">
					{!transaction.enabled && <Badge variant="destructive">disabled</Badge>}
					<Badge variant="secondary">{transaction.interval}</Badge>
				</CardFooter>
			</Card>
		</Link>
	);
};

export default RecurringTransactionCard;
