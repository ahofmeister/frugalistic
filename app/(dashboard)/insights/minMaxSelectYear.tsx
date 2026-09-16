import { sql } from "drizzle-orm";
import SelectYear from "@/app/(dashboard)/insights/select-year";
import { dbTransaction } from "@/drizzle/client";
import { transactions } from "@/drizzle/schema/transaction-schema";

export async function MinMaxSelectYear() {
	const [{ minYear, maxYear }] = await dbTransaction((tx) =>
		tx
			.select({
				minYear: sql<number | null>`extract(year from min(${transactions.datetime}))`,
				maxYear: sql<number | null>`extract(year from max(${transactions.datetime}))`,
			})
			.from(transactions),
	);

	return <SelectYear min={minYear ?? undefined} max={maxYear ?? undefined} />;
}
