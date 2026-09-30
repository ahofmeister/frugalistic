import type { SearchParams } from "nuqs/server";
import TransactionCategoryDistributionChart from "@/app/(dashboard)/insights/transaction-category-distribution-chart";
import { dbTransaction } from "@/drizzle/client";
import { getActiveAccountId } from "@/features/account/account-actions";
import { getDateRange, loadYearSearchParam } from "@/lib/utils";

export async function TransactionCategoryDistribution({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const { year } = await loadYearSearchParam(searchParams);
	const { dateFrom, dateTo } = getDateRange("year", year, 1);

	const activeAccountId = await getActiveAccountId();

	const data = await dbTransaction((tx) =>
		tx.query.transactions.findMany({
			where: {
				accountId: activeAccountId,
				datetime: {
					gte: dateFrom,
					lte: dateTo,
				},
				type: {
					eq: "expense",
				},
			},
			with: {
				category: true,
			},
		}),
	);

	return <TransactionCategoryDistributionChart allTransactions={data} />;
}
