import { isNotNull } from "drizzle-orm";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { dbTransaction } from "@/drizzle/client";
import { transactions } from "@/drizzle/schema/transaction-schema";

export const NumberTransactions = async () => {
	const totalCount = await dbTransaction((tx) => tx.$count(transactions));

	const recurringCount = await dbTransaction((tx) =>
		tx.$count(transactions, isNotNull(transactions.recurringTransactionId)),
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
