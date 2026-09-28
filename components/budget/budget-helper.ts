import { endOfMonth, endOfYear, format, startOfMonth, startOfYear } from "date-fns";
import type { budgetSchema } from "@/drizzle/schema";

export function getBudgetDateRange(
	budget: typeof budgetSchema.$inferSelect,
	viewedPeriod: { year: number; month: number },
) {
	if (budget.type === "manual") {
		return {
			start: budget.startDate,
			end: budget.targetDate ?? budget.startDate,
		};
	}

	const periodDate =
		budget.interval === "monthly" || (budget.type === "month" && budget.interval == null)
			? new Date(viewedPeriod.year, viewedPeriod.month, 1)
			: new Date(budget.startDate);

	if (budget.type === "month") {
		return {
			start: format(startOfMonth(periodDate), "yyyy-MM-dd"),
			end: format(endOfMonth(periodDate), "yyyy-MM-dd"),
		};
	}

	return {
		start: format(startOfYear(periodDate), "yyyy-MM-dd"),
		end: format(endOfYear(periodDate), "yyyy-MM-dd"),
	};
}
