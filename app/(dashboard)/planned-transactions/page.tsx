import { Suspense } from "react";
import PlannedTransactions from "@/features/transactions/components/planned/planned-transactions";

export default function BudgetsPage() {
	return (
		<div className="space-y-6">
			<Suspense>
				<PlannedTransactions />
			</Suspense>
		</div>
	);
}
