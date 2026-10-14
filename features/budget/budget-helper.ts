import { endOfMonth, endOfYear, format, startOfMonth, startOfYear } from "date-fns";
import type { budgetSchema } from "@/drizzle/schema";
import { DB_DATE_FORMAT } from "@/lib/utils";

export function getBudgetDateRange(
	budget: typeof budgetSchema.$inferSelect,
	viewedPeriod: { year: number; month: number },
) {
	if (budget.period === "manual") {
		return {
			start: budget.startDate,
			end: budget.targetDate ?? budget.startDate,
		};
	}

	const periodDate =
		budget.repeating === "monthly" || (budget.period === "month" && budget.repeating == null)
			? new Date(viewedPeriod.year, viewedPeriod.month, 1)
			: new Date(budget.startDate);

	if (budget.period === "month") {
		return {
			start: format(startOfMonth(periodDate), DB_DATE_FORMAT),
			end: format(endOfMonth(periodDate), DB_DATE_FORMAT),
		};
	}

	return {
		start: format(startOfYear(periodDate), DB_DATE_FORMAT),
		end: format(endOfYear(periodDate), DB_DATE_FORMAT),
	};
}
