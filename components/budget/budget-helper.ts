import { endOfMonth, endOfYear, format, startOfMonth, startOfYear } from "date-fns";
import type { budgetSchema } from "@/drizzle/schema";

export function getBudgetDateRange(budget: typeof budgetSchema.$inferSelect) {
	const startDate = new Date(budget.startDate);

	if (budget.type === "manual") {
		return {
			start: budget.startDate,
			end: budget.targetDate,
		};
	}

	if (budget.interval === "monthly") {
		return {
			start: format(startOfMonth(startDate), "yyyy-MM-dd"),
			end: format(endOfMonth(startDate), "yyyy-MM-dd"),
		};
	}

	return {
		start: format(startOfYear(startDate), "yyyy-MM-dd"),
		end: format(endOfYear(startDate), "yyyy-MM-dd"),
	};
}
