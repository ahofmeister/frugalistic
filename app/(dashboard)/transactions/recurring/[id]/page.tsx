import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RecurringTransactionHistory } from "@/app/(dashboard)/transactions/recurring/[id]/recurring-transaction-history";
import DeleteRecurringTransaction from "@/app/(dashboard)/transactions/recurring/delete-recurring-transaction";
import RecurringTransactionForm from "@/components/transactions/recurring/components/recurring-transaction-form";
import { createClient } from "@/utils/supabase/server";

export default async function TransactionEditPage(props: {
	params: Promise<{ id: string }>;
}) {
	return (
		<div>
			<div className="space-y-6 mx-auto max-w-lg">
				<div className="flex flex-col gap-y-4">
					<Suspense>
						<RecurringTransactionWrapper id={props.params.then((p) => p.id)} />
					</Suspense>
					<div className="my-8 mx-auto w-full">
						<div className="w-full">
							<Suspense>
								<DeleteRecurringTransaction
									id={props.params.then((p) => p.id)}
								/>
							</Suspense>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-6 mx-auto max-w-lg">
				<div className="text-lg mb-2">Transaction History</div>
				<Suspense>
					<RecurringTransactionHistory
						recurringTransactionId={props.params.then((p) => p.id)}
					/>
				</Suspense>
			</div>
		</div>
	);
}

const RecurringTransactionWrapper = async ({ id }: { id: Promise<string> }) => {
	const supabase = await createClient();
	const { data: transaction } = await supabase
		.from("transactions_recurring")
		.select("*")
		.eq("id", await id)
		.single();

	if (!transaction) {
		notFound();
	}

	return <RecurringTransactionForm transaction={transaction} />;
};
