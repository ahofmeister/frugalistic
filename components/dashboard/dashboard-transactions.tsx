import { and, desc, gte, lte } from "drizzle-orm";
import type { DashboardParams } from "@/app/(dashboard)/dashboard/page";
import { loadSearchParams } from "@/app/(dashboard)/search-params";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import TransactionList from "@/components/transactions/components/transaction-list";
import { dbTransaction } from "@/db";
import { type TransactionWithRecurringCategory, transactionSchema } from "@/db/migrations/schema";
import { getPeriodDates } from "@/utils/transaction/dates";

export default async function DashboardTransactions({
	searchParams,
}: {
	searchParams: Promise<DashboardParams>;
}) {
	const awaitedParams = await loadSearchParams(searchParams);

	const { startDate, endDate } = getPeriodDates(
		awaitedParams.year,
		awaitedParams.month,
		awaitedParams.period,
	);

	const transactionsWithRecurring: TransactionWithRecurringCategory[] = await dbTransaction(
		(tx) => {
			return tx.query.transactionSchema.findMany({
				where: and(
					gte(transactionSchema.datetime, startDate),
					lte(transactionSchema.datetime, endDate),
				),
				with: {
					category: true,
					recurringTransaction: true,
				},
				orderBy: [desc(transactionSchema.datetime), desc(transactionSchema.createdAt)],
			});
		},
	);

	const settings = await getSettings();

	return (
		<TransactionList
			transactions={transactionsWithRecurring ?? []}
			dateFormat={settings.date_format}
		/>
	);
}
