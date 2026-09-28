import type { SearchParams } from "nuqs/server";
import { TransactionsChart } from "@/app/(dashboard)/insights/transactions-chart";
import { getActiveAccountId } from "@/components/account/account-actions";
import { dbTransaction } from "@/drizzle/client";
import { getDateRange, loadYearSearchParam } from "@/lib/utils";

export async function InsightsTransactionsTypes({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const { year } = await loadYearSearchParam(searchParams);

	const { dateFrom, dateTo } = getDateRange("year", year, 1);

	const activeAccountId = await getActiveAccountId();

	const transactions = await dbTransaction((tx) => {
		return tx.query.transactions.findMany({
			where: {
				accountId: activeAccountId,
				datetime: {
					gte: dateFrom,
					lte: dateTo,
				},
			},
			with: {
				category: true,
			},
		});
	});

	return <TransactionsChart transactions={transactions} />;
}
