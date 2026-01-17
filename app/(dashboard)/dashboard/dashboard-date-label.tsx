"use client";
import { format } from "date-fns";
import { useQueryState } from "nuqs";
import { parseMonth, parsePeriod, parseYear } from "@/lib/utils";

export function DashboardDateLabel() {
	const [month] = useQueryState("month", parseMonth);
	const [year] = useQueryState("year", parseYear);
	const [period] = useQueryState("period", parsePeriod);

	if (period === "year") {
		return <>{year}</>;
	}

	return format(new Date(year, month, 1), "MMMM yyyy");
}
