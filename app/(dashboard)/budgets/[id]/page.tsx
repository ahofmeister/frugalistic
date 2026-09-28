import { Suspense } from "react";
import { BudgetInformation } from "@/components/budget/budget-information";
import { BudgetTransactions } from "@/components/budget/budget-transactions";

export default async function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
	return (
		<div className="flex flex-col gap-y-8">
			<Suspense>
				<BudgetInformation budgetId={params.then((p) => p.id)} />
			</Suspense>
			<Suspense>
				<BudgetTransactions budgetId={params.then((p) => p.id)} />
			</Suspense>
		</div>
	);
}
