import Link from "next/link";
import { dbTransaction } from "@/drizzle/client";
import { transactionsRecurring } from "@/drizzle/schema/transaction-recurring-schema";
import { Card } from "@/features/ui/card";

const RecurringTransactionsCard = async () => {
	const recurringCount = await dbTransaction((tx) => tx.$count(transactionsRecurring));

	return (
		<Link href="/transactions/recurring">
			<Card className="flex justify-between">
				<div>Recurring Transactions</div>
				<div>{recurringCount}</div>
			</Card>
		</Link>
	);
};

export default RecurringTransactionsCard;
