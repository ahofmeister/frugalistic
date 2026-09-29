import { Suspense } from "react";
import { BudgetOverview } from "@/features/budget/budget-overview";
import { BudgetTransactions } from "@/features/budget/budget-transactions";
import DeleteBudget from "@/features/budget/delete-budget";

export default async function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
	return (
		<div className="flex flex-col gap-y-8">
			<Suspense>
				<BudgetOverview budgetId={params.then((p) => p.id)} />
			</Suspense>
			<Suspense>
				<BudgetTransactions budgetId={params.then((p) => p.id)} />
			</Suspense>
		</div>
	);
}
