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

	return <TransactionList transactions={transactions} />;
};

export default PlannedTransactions;
