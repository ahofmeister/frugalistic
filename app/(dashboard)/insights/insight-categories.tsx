import { and, eq, gte, lte, sql } from "drizzle-orm";
import type { SearchParams } from "nuqs/server";
import InsightCategoryCard from "@/app/(dashboard)/insights/insight-category-card";
import { dbTransaction } from "@/drizzle/client";
import { categories, transactions } from "@/drizzle/schema";
import { loadYearSearchParam } from "@/lib/utils";
import { getYearBoundaries } from "@/utils/transaction/dates";

export async function InsightCategories({ searchParams }: { searchParams: Promise<SearchParams> }) {
	const { year } = await loadYearSearchParam(searchParams);

	const currentYear = getYearBoundaries(year);
	const previousYear = getYearBoundaries(year - 1);

	const [data, previousYearData] = await dbTransaction((tx) =>
		Promise.all([
			tx
				.select({
					name: categories.name,
					color: categories.color,
					total: sql<number>`sum(${transactions.amount})`,
				})
				.from(transactions)
				.innerJoin(categories, eq(transactions.categoryId, categories.id))
				.where(
					and(
						eq(transactions.type, "expense"),
						gte(transactions.datetime, currentYear.startDate),
						lte(transactions.datetime, currentYear.endDate),
					),
				)
				.groupBy(categories.name, categories.color),

			tx
				.select({
					name: categories.name,
					color: categories.color,
					total: sql<number>`sum(${transactions.amount})`,
				})
				.from(transactions)
				.innerJoin(categories, eq(transactions.categoryId, categories.id))
				.where(
					and(
						eq(transactions.type, "expense"),
						gte(transactions.datetime, previousYear.startDate),
						lte(transactions.datetime, previousYear.endDate),
					),
				)
				.groupBy(categories.id, categories.name, categories.color),
		]),
	);

	return (
		<div className="grid grid-cols-2 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
			{data.map((category) => {
				const previousTotal = previousYearData.find(
					(prevCategory) => prevCategory.name === category.name,
				)?.total;

				return (
					<InsightCategoryCard
						year={year}
						key={category.name}
						category={category}
						previousTotal={previousTotal}
						months={getMonthsInYear(year)}
					/>
				);
			})}
		</div>
	);
}

function getMonthsInYear(year: number): number {
	return year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;
}
