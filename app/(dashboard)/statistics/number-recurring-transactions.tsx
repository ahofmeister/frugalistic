import { eq } from "drizzle-orm";
import { getActiveAccountId } from "@/features/account/account-actions";
import { Card, CardFooter, CardHeader, CardTitle } from "@/features/ui/card";
import { dbTransaction } from "@/drizzle/client";
import { transactionsRecurring } from "@/drizzle/schema";

export const NumberRecurringTransactions = async () => {
	const activeAccountId = await getActiveAccountId();

	const count = await dbTransaction((tx) =>
		tx.$count(transactionsRecurring, eq(transactionsRecurring.accountId, activeAccountId)),
	);

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
