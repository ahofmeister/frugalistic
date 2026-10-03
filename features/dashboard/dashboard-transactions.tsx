import type { SearchParams } from "nuqs/server";
import { loadDashboardParams } from "@/app/(dashboard)/search-params";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import { dbTransaction } from "@/drizzle/client";
import { getActiveAccountId } from "@/features/account/account-actions";
import TransactionList from "@/features/transactions/components/transaction-list";
import { getPeriodDates } from "@/features/transactions/dates";

export default async function DashboardTransactions({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const awaitedParams = await loadDashboardParams(searchParams);

	const { startDate, endDate } = getPeriodDates(
		awaitedParams.year,
		awaitedParams.month,
		awaitedParams.period,
	);

	const accountId = await getActiveAccountId();

	const transactionsWithRecurring = await dbTransaction((tx) => {
		return tx.query.transactions.findMany({
			where: {
				datetime: {
					gte: startDate,
					lte: endDate,
				},
				accountId: accountId,
			},
			with: {
				category: true,
				recurringTransaction: true,
			},
			orderBy: {
				datetime: "desc",
				createdAt: "desc",
			},
		});
	});

	const settings = await getSettings();

	return <TransactionList transactions={transactionsWithRecurring ?? []} settings={settings} />;
}
