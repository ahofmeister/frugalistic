import { eq } from "drizzle-orm";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import TransactionList from "@/components/transactions/components/transaction-list";
import { dbTransaction } from "@/drizzle/client";

import { transactions } from "@/drizzle/schema/transaction-schema";

export async function RelatedTransactions(props: { id: Promise<string> }) {
	const id = await props.id;

	const [transaction] = await dbTransaction((tx) => {
		return tx.select().from(transactions).where(eq(transactions.id, id)).limit(1);
	});

	if (!transaction) {
		return;
	}

	const foundTransactions = await dbTransaction((tx) => {
		return tx.query.transactions.findMany({
			where: {
				description: {
					eq: transaction.description,
				},
				id: {
					ne: transaction.id,
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

	if (!foundTransactions || foundTransactions.length === 0) {
		return;
	}

	const settings = await getSettings();

	return <TransactionList transactions={foundTransactions} dateFormat={settings.dateFormat} />;
}
