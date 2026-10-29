"use client";
import FormattedDate from "@/app/(dashboard)/dashboard/formatted-date";
import type { budgetSchema } from "@/drizzle/schema";

const typeLabels = {
	month: "Monthly budget",
	year: "Yearly budget",
	manual: "Custom budget",
} as const;

const intervalLabels = {
	monthly: "Every month",
	annually: "Every year",
} as const;

export function BudgetSubtitle({ budget }: { budget: typeof budgetSchema.$inferSelect }) {
	if (budget.period === "manual") {
		return (
			<p className="text-sm text-muted-foreground">
				<FormattedDate date={budget.startDate} /> –{" "}
				{budget.targetDate && <FormattedDate date={budget.targetDate} />}
			</p>
		);
	}

	return (
		<p className="text-sm text-muted-foreground">
			{typeLabels[budget.period]}
			{budget.repeating ? `, ${intervalLabels[budget.repeating].toLowerCase()}` : ""}
		</p>
	);
}
