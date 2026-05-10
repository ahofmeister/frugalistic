import { format } from "date-fns";
import type { SearchParams } from "nuqs/server";
import { loadDashboardParams } from "@/app/(dashboard)/search-params";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import RecurringTransactionCard from "@/app/(dashboard)/transactions/recurring/recurring-transaction-card";
import { getRecurringTransactionsForMonth } from "@/components/transactions/transactions-api";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export default async function NextRecurringTransactions(props: {
	searchParams: Promise<SearchParams>;
}) {
	const params = await loadDashboardParams(props.searchParams);
	const recurringTransactions = await getRecurringTransactionsForMonth(params.year, params.month);

	const settings = await getSettings();

	return (
		<Accordion type="single" collapsible>
			<AccordionItem value="recurringTransactions">
				<AccordionTrigger>Next recurring transactions</AccordionTrigger>
				<AccordionContent>
					<div className="flex flex-col gap-y-2">
						{recurringTransactions.map((transaction) => {
							const day = new Date(transaction.nextRun ?? new Date()).getDate();
							const projectedDate = format(new Date(params.year, params.month, day), "yyyy-MM-dd");

							return (
								<RecurringTransactionCard
									key={transaction.id}
									transaction={{ ...transaction, nextRun: projectedDate }}
									dateFormat={settings.date_format}
								/>
							);
						})}
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
