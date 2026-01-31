import { desc, eq } from "drizzle-orm";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import TransactionList from "@/components/transactions/components/transaction-list";
import { dbTransaction } from "@/db";
import { transactionSchema } from "@/db/migrations/schema";

export async function RecurringTransactionHistory(props: {
	recurringTransactionId: Promise<string>;
}) {
	const id = await props.recurringTransactionId;

	const transactions = await dbTransaction((tx) => {
		return tx.query.transactionSchema.findMany({
			where: eq(transactionSchema.recurringTransaction, id),
			with: {
				category: true,
				recurringTransaction: true,
			},
			orderBy: [desc(transactionSchema.datetime)],
		});
	});

	const settings = await getSettings();
	return <TransactionList transactions={transactions} dateFormat={settings.date_format} />;
}
