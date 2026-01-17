import { count, isNotNull } from "drizzle-orm";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { dbTransaction } from "@/db";
import { transactionSchema } from "@/db/migrations/schema";

export const NumberTransactions = async () => {
	const [{ count: totalCount }] = await dbTransaction((tx) => {
		return tx.select({ count: count() }).from(transactionSchema);
	});

	const [{ count: recurringCount }] = await dbTransaction((tx) => {
		return tx
			.select({ count: count() })
			.from(transactionSchema)
			.where(isNotNull(transactionSchema.recurringTransaction));
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="text-xl">Transactions</div>
				</CardTitle>
			</CardHeader>
			<CardFooter className="flex flex-col items-start gap-1">
				<div>{totalCount}</div>
				<div className="text-sm text-muted-foreground">
					{recurringCount} from recurring
				</div>
			</CardFooter>
		</Card>
	);
};
