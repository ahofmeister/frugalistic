import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import { RecurringTransactionHistory } from "@/app/(dashboard)/transactions/recurring/[id]/recurring-transaction-history";
import DeleteRecurringTransaction from "@/app/(dashboard)/transactions/recurring/delete-recurring-transaction";
import { dbTransaction } from "@/drizzle/client";
import { getCategories } from "@/features/categories/categories-api";
import RecurringTransactionForm from "@/features/transactions/recurring/components/recurring-transaction-form";
import { getActiveWebhooks } from "@/features/webhooks/webhook-actions";

export default async function TransactionEditPage(props: { params: Promise<{ id: string }> }) {
	return (
		<div>
			<div className="space-y-6 mx-auto max-w-2xl">
				<div className="flex flex-col gap-y-4">
					<Suspense>
						<RecurringTransactionWrapper id={props.params.then((p) => p.id)} />
					</Suspense>
					<div className="my-8 mx-auto w-full">
						<div className="w-full">
							<Suspense>
								<DeleteRecurringTransaction id={props.params.then((p) => p.id)} />
							</Suspense>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-6 mx-auto max-w-2xl">
				<div className="text-lg mb-2">Transaction History</div>
				<Suspense>
					<RecurringTransactionHistory recurringTransactionId={props.params.then((p) => p.id)} />
				</Suspense>
			</div>
		</div>
	);
}

const RecurringTransactionWrapper = async ({ id }: { id: Promise<string> }) => {
	const transaction = await dbTransaction(async (tx) => {
		return tx.query.transactionsRecurring.findFirst({
			where: {
				id: await id,
			},
		});
	});

	if (!transaction) {
		notFound();
	}

	const allCategories = await getCategories();
	const settings = await getSettings();
	const webhooks = await getActiveWebhooks();

	return (
		<div className="max-w-2xl mx-auto px-2">
			<RecurringTransactionForm
				transaction={transaction}
				allCategories={allCategories}
				settings={settings}
				webhooks={webhooks}
			/>
		</div>
	);
};
