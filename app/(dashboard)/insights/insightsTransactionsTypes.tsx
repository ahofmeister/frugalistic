import type { SearchParams } from "nuqs/server";
import { TransactionsChart } from "@/app/(dashboard)/insights/transactions-chart";
import { dbTransaction } from "@/drizzle/client";
import { getDateRange, loadYearSearchParam } from "@/lib/utils";

export async function InsightsTransactionsTypes({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const { year } = await loadYearSearchParam(searchParams);

	const { dateFrom, dateTo } = getDateRange("year", year, 1);

	const transactions = await dbTransaction((tx) => {
		return tx.query.transactions.findMany({
			where: {
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
