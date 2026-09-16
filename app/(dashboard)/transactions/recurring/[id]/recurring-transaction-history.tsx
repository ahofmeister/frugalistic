import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import TransactionList from "@/components/transactions/components/transaction-list";
import { dbTransaction } from "@/drizzle/client";

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

	const settings = await getSettings();
	return <TransactionList transactions={foundTransactions} dateFormat={settings.dateFormat} />;
}
