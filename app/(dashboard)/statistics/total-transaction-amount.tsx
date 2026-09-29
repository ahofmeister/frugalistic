import { and, eq, sum } from "drizzle-orm";
import { getActiveAccountId } from "@/features/account/account-actions";
import TransactionAmount from "@/features/transactions/components/transaction-amount";
import { Card, CardFooter, CardHeader, CardTitle } from "@/features/ui/card";
import { dbTransaction } from "@/drizzle/client";
import { type TransactionType, transactions } from "@/drizzle/schema";
import { capitalize } from "@/lib/utils";

export async function TotalTransactionAmount(props: { type: TransactionType }) {
	const activeAccountId = await getActiveAccountId();

	const [result] = await dbTransaction((tx) => {
		return tx
			.select({
				sum: sum(transactions.amount),
			})
			.from(transactions)
			.where(and(eq(transactions.type, props.type), eq(transactions.accountId, activeAccountId)));
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="text-xl">Total {capitalize(props.type)}</div>
				</CardTitle>
			</CardHeader>
			<CardFooter>
				<TransactionAmount amount={Number(result?.sum ?? 0)} type={props.type} />
			</CardFooter>
		</Card>
	);
}
