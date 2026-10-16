import { Suspense } from "react";
import { TransactionFormData } from "@/app/(dashboard)/transactions/new/transaction-form-data";

export default async function NewTransactionPage() {
	return (
		<div className="max-w-2xl mx-auto px-2">
			<Suspense>
				<TransactionFormData />
			</Suspense>
		</div>
	);
}
