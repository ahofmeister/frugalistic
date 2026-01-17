import { Suspense } from "react";

import RecurringTransactions from "@/app/(dashboard)/transactions/recurring/recurring-transactions";
import { Spinner } from "@/components/ui/spinner";

export default function TransactionsPage() {
	return (
		<div className="flex gap-10">
			<Suspense fallback={<Spinner />}>
				<RecurringTransactions />
			</Suspense>
		</div>
	);
}
