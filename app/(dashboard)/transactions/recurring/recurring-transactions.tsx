import Link from "next/link";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import RecurringTransactionCard from "@/app/(dashboard)/transactions/recurring/recurring-transaction-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";

const RecurringTransactions = async () => {
	const supabase = await createClient();

	const { data: transactions } = await supabase
		.from("transactions_recurring")
		.select();

	const typeOrder = { expense: 1, savings: 2, income: 3 };

	const sortedTransactions = transactions?.sort((a, b) => {
		if (a.enabled !== b.enabled) {
			return a.enabled ? -1 : 1;
		}

		const typeComparison = typeOrder[a.type] - typeOrder[b.type];
		if (typeComparison !== 0) {
			return typeComparison;
		}

		return a.description.localeCompare(b.description);
	});

	const settings = await getSettings();

	return (
		<div className="w-full">
			<div className="text-2xl font-semibold mb-4">Recurring Transactions</div>
			{sortedTransactions?.length === 0 && (
				<Card className=" inset-0 gap-y-4 flex flex-col h-[240px] items-center justify-center  text-muted-foreground text-lg">
					No recurring transactions to display yet!
					<Link href="/transactions/new">
						<Button variant="default">
							<div className="flex">New Transaction</div>
						</Button>
					</Link>
				</Card>
			)}

			<div className="flex flex-col gap-y-2">
				{sortedTransactions?.map((transaction) => (
					<RecurringTransactionCard
						dateFormat={settings.date_format}
						key={transaction.id}
						transaction={transaction}
					/>
				))}
			</div>
		</div>
	);
};

export default RecurringTransactions;
