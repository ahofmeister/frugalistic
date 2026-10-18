import { Suspense } from "react";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import { getCategories } from "@/features/categories/categories-api";
import RecurringTransactionForm from "@/features/transactions/recurring/components/recurring-transaction-form";
import { getActiveWebhooks } from "@/features/webhooks/webhook-actions";

export default async function NewRecurringTransactionPage() {
	return (
		<div>
			<div className="space-y-6 mx-auto max-w-2xl">
				<div className="flex flex-col gap-y-4">
					<Suspense>
						<RecurringTransactionWrapper />
					</Suspense>
				</div>
			</div>
		</div>
	);
}

const RecurringTransactionWrapper = async () => {
	const allCategories = await getCategories();
	const settings = await getSettings();
	const webhooks = await getActiveWebhooks();

	return (
		<RecurringTransactionForm
			webhooks={webhooks}
			settings={settings}
			allCategories={allCategories}
		/>
	);
};
