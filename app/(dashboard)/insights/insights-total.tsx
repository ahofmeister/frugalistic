import type { SearchParams } from "nuqs/server";
import InsightsTotalCard from "@/app/(dashboard)/insights/insights-total-card";
import { loadYearSearchParam } from "@/lib/utils";
import type { TransactionType } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function InsightsTotal({
	searchParams,
	type,
}: {
	searchParams: Promise<SearchParams>;
	type: TransactionType;
}) {
	const supabase = await createClient();

	const { year } = await loadYearSearchParam(searchParams);

	const { data: currentYear } = await (async () => {
		return supabase
			.rpc("get_total_by_type_and_year", {
				transaction_year: year,
				transaction_type: type,
			})
			.select("*")
			.single();
	})();

	const { data: previousYear } = await supabase
		.rpc("get_total_by_type_and_year", {
			transaction_year: year - 1,
			transaction_type: type,
		})
		.select("*")
		.single();

	return (
		<InsightsTotalCard
			year={year}
			type={type}
			currentYearTotal={currentYear?.total}
			previousYearTotal={previousYear?.total}
		/>
	);
}
