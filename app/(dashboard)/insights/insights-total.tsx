import type { SearchParams } from "nuqs/server";
import InsightsTotalCard from "@/app/(dashboard)/insights/insights-total-card";
import { getTotalByTypeAndYear } from "@/components/transactions/transactions-api";
import type { TransactionType } from "@/drizzle/schema";
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
