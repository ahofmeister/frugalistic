import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import { dbTransaction } from "@/drizzle/client";
import { TransactionCard } from "@/features/transactions/components/transaction-card";

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

	return (
		<div>
			{transactions.map((transaction) => (
				<TransactionCard key={transaction.id} transaction={transaction} settings={settings} />
			))}
		</div>
	);
};

export default PlannedTransactions;
