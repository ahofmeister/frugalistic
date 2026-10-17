import { Suspense } from "react";

import { RelatedTransactions } from "@/app/(dashboard)/transactions/edit/[id]/related-transactions";
import { TransactionFormData } from "@/app/(dashboard)/transactions/new/transaction-form-data";

export default async function TransactionEditPage(props: { params: Promise<{ id: string }> }) {
	return (
		<div className="max-w-4xl mx-auto px-2">
			<Suspense>
				<TransactionFormData redirectNotFound transactionId={props.params.then((p) => p.id)} />
			</Suspense>
			<Suspense>
				<RelatedTransactions id={props.params.then((p) => p.id)} />
			</Suspense>
		</div>
	);
}
