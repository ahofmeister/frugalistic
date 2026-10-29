import { dbTransaction } from "@/drizzle/client";
import TransactionList from "@/features/transactions/components/transaction-list";

export async function RecurringTransactionHistory(props: {
	recurringTransactionId: Promise<string>;
}) {
	const id = await props.recurringTransactionId;

	const foundTransactions = await dbTransaction((tx) => {
		return tx.query.transactions.findMany({
			where: {
				recurringTransactionId: {
					eq: id,
				},
			},
			with: {
				category: true,
				recurringTransaction: true,
			},
			orderBy: {
				datetime: "desc",
			},
		});
	});

	return <TransactionList transactions={foundTransactions} />;
}
