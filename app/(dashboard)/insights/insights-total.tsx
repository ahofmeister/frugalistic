import type { SearchParams } from "nuqs/server";
import InsightsTotalCard from "@/app/(dashboard)/insights/insights-total-card";
import type { TransactionType } from "@/drizzle/schema";
import { getTotalByTypeAndYear } from "@/features/transactions/transactions-api";
import { loadYearSearchParam } from "@/lib/utils";

export async function InsightsTotal({
	searchParams,
	type,
}: {
	searchParams: Promise<SearchParams>;
	type: TransactionType;
}) {
	const { year } = await loadYearSearchParam(searchParams);

	const [currentYearTotal, previousYearTotal] = await Promise.all([
		getTotalByTypeAndYear(type, year),
		getTotalByTypeAndYear(type, year - 1),
	]);

	return (
		<InsightsTotalCard
			year={year}
			type={type}
			currentYearTotal={currentYearTotal ?? 0}
			previousYearTotal={previousYearTotal ?? 0}
		/>
	);
}
