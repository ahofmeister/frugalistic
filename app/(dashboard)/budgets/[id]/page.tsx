import { Suspense } from "react";
import { BudgetInformation } from "@/components/budget/budget-information";

export default async function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
	return (
		<Suspense>
			<BudgetInformation budgetId={params.then((p) => p.id)} />
		</Suspense>
	);
}
