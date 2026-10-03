import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import { findBudgetById, findBudgetTransactions } from "@/features/budget/budget-actions";
import TransactionList from "@/features/transactions/components/transaction-list";

export async function BudgetTransactions({ budgetId }: { budgetId: Promise<string> }) {
	const id = await budgetId;
	const [budget, settings] = await Promise.all([findBudgetById(id), getSettings()]);

	if (!budget) {
		return null;
	}

	const transactions = await findBudgetTransactions(
		budget.categoryId,
		budget.startDate,
		budget.targetDate,
	);

	return (
		<section className="flex flex-col gap-2">
			<TransactionList transactions={transactions} settings={settings} />
		</section>
	);
}
