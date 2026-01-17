import { Suspense } from "react";
import { TransactionFormData } from "@/app/(dashboard)/transactions/new/transaction-form-data";

export default async function NewTransactionPage() {
	return (
		<Suspense>
			<TransactionFormData />
		</Suspense>
	);
}
