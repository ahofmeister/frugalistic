import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import { dbTransaction } from "@/drizzle/client";
import TransactionList from "@/features/transactions/components/transaction-list";

const PlannedTransactions = async () => {
	const transactions = await dbTransaction((tx) => {
		return tx.query.transactions.findMany({
			where: {
				status: "planned",
			},
			with: {
				recurringTransaction: true,
				category: true,
			},
		});
	});

	const settings = await getSettings();

	return <TransactionList transactions={transactions} settings={settings} />;
};

export default PlannedTransactions;
