import type { SearchParams } from "nuqs/server";
import { TransactionsChart } from "@/app/(dashboard)/insights/transactions-chart";
import { getDateRange, loadYearSearchParam } from "@/lib/utils";
import type { TransactionWithCategory } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function InsightsTransactionsTypes({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const supabase = await createClient();

	const { year } = await loadYearSearchParam(searchParams);

	const { data: transactions = [] } = await supabase
		.from("transactions")
		.select("*, category(*)")
		.gte("datetime", getDateRange("year", year, 1).dateFrom)
		.lte("datetime", getDateRange("year", year, 1).dateTo)
		.returns<TransactionWithCategory[]>();

	return <TransactionsChart transactions={transactions ?? []} />;
}
