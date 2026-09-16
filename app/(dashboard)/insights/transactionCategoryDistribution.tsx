import { and, eq, gte, lte } from "drizzle-orm";
import type { SearchParams } from "nuqs/server";
import TransactionCategoryDistributionChart from "@/app/(dashboard)/insights/transaction-category-distribution-chart";
import { dbTransaction } from "@/drizzle/client";
import { categories, transactions } from "@/drizzle/schema";
import { getDateRange, loadYearSearchParam } from "@/lib/utils";

export async function TransactionCategoryDistribution({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const { year } = await loadYearSearchParam(searchParams);
	const { dateFrom, dateTo } = getDateRange("year", year, 1);

	const data = await dbTransaction((tx) =>
		tx
			.select()
			.from(transactions)
			.innerJoin(categories, eq(transactions.categoryId, categories.id))
			.where(
				and(
					gte(transactions.datetime, dateFrom),
					lte(transactions.datetime, dateTo),
					eq(transactions.type, "expense"),
				),
			),
	);

	return (
		<TransactionCategoryDistributionChart
			allTransactions={data.map(({ transactions, categories }) => ({
				...transactions,
				category: categories,
			}))}
		/>
	);
}
