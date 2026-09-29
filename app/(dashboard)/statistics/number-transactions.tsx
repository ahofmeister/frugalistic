import { and, eq, isNotNull } from "drizzle-orm";
import { dbTransaction } from "@/drizzle/client";
import { transactions } from "@/drizzle/schema/transaction-schema";
import { getActiveAccountId } from "@/features/account/account-actions";
import { Card, CardFooter, CardHeader, CardTitle } from "@/features/ui/card";

export const NumberTransactions = async () => {
	const activeAccountId = await getActiveAccountId();

	const [totalCount, recurringCount] = await dbTransaction((tx) =>
		Promise.all([
			tx.$count(transactions, eq(transactions.accountId, activeAccountId)),
			tx.$count(
				transactions,
				and(
					eq(transactions.accountId, activeAccountId),
					isNotNull(transactions.recurringTransactionId),
				),
			),
		]),
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="text-xl">Transactions</div>
				</CardTitle>
			</CardHeader>
			<CardFooter className="flex flex-col items-start gap-1">
				<div>{totalCount}</div>
				<div className="text-sm text-muted-foreground">{recurringCount} from recurring</div>
			</CardFooter>
		</Card>
	);
};
