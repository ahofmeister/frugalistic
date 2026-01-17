import { endOfMonth, endOfYear, format, formatDate } from "date-fns";

import type { Period } from "@/components/dashboard/period-selector";

export function getPeriodDates(year: number, month: number, period: Period) {
	const isYear = period === "year";

	const startDate = isYear ? new Date(year, 0, 1) : new Date(year, month, 1);

	const endDate = isYear
		? endOfYear(new Date(year, 0, 1))
		: endOfMonth(new Date(year, month, 1));

	return {
		startDate: format(startDate, "yyyy-MM-dd"),
		endDate: format(endDate, "yyyy-MM-dd"),
	};
}

export function getYearBoundaries(year: number) {
	const startDate = format(new Date(year, 0, 1), "yyyy-MM-dd");
	const endDate = formatDate(new Date(year, 11, 31), "yyyy-MM-dd");

	return { startDate, endDate };
}
