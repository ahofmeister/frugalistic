import { notFound } from "next/navigation";
import { Suspense } from "react";
import { validate } from "uuid";
import { getBudgetDateRange } from "@/components/budget/budget-helper";
import TransactionList from "@/components/transactions/components/transaction-list";
import { dbTransaction } from "@/drizzle/client";

async function BudgetTransactions(props: { budgetId: Promise<string> }) {
	const budgetId = await props.budgetId;

	if (!validate(budgetId)) {
		return notFound();
	}

	const budget = await dbTransaction((tx) => {
		return tx.query.budgetSchema.findFirst({
			where: {
				id: budgetId,
			},
		});
	});

	if (!budget) {
		notFound();
	}

	const { start, end } = getBudgetDateRange(budget);

	const transactions = await dbTransaction((tx) => {
		return tx.query.transactions.findMany({
			where: {
				categoryId: budget.categoryId,
				datetime: {
					gte: start,
					lte: end ?? undefined,
				},
			},
			orderBy: {
				datetime: "desc",
			},
			with: {
				category: true,
				recurringTransaction: true,
			},
		});
	});

	return <TransactionList transactions={transactions} dateFormat={"yyyy-MM-dd"} />;
}

export default async function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
	return (
		<Suspense>
			<BudgetTransactions budgetId={params.then((p) => p.id)} />
		</Suspense>
	);
}
