import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { dbTransaction } from "@/drizzle/client";
import { transactionsRecurring } from "@/drizzle/schema";

export const NumberRecurringTransactions = async () => {
	const count = await dbTransaction((tx) => tx.$count(transactionsRecurring));
	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="text-xl">Recurring</div>
				</CardTitle>
			</CardHeader>
			<CardFooter>{count}</CardFooter>
		</Card>
	);
};
