import { differenceInCalendarDays, formatDate, parseISO } from "date-fns";
import { notFound } from "next/navigation";
import { validate } from "uuid";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import { findBudgetById, findBudgetTransactions } from "@/components/budget/budget-actions";
import { getTextColor } from "@/components/transactions/colors";
import { formatAmount } from "@/components/transactions/components/transaction-amount";
import type { budgetSchema } from "@/drizzle/schema";
import { capitalize } from "@/lib/utils";

const typeLabels = {
	month: "Monthly budget",
	year: "Yearly budget",
	manual: "Custom budget",
} as const;

const intervalLabels = {
	monthly: "Every month",
	annually: "Every year",
} as const;

export async function BudgetInformation(props: { budgetId: Promise<string> }) {
	const budgetId = await props.budgetId;

	if (!validate(budgetId)) {
		return notFound();
	}

	const budget = await findBudgetById(budgetId);

	if (!budget) {
		notFound();
	}

	const budgetTransactions = await findBudgetTransactions(
		budget.categoryId,
		budget.startDate,
		budget.targetDate,
	);

	const expenses = budgetTransactions
		.filter((transaction) => transaction.type === "expense")
		.reduce((total, transaction) => total + transaction.amount, 0);

	const income = budgetTransactions
		.filter((transaction) => transaction.type === "income")
		.reduce((total, transaction) => total + transaction.amount, 0);

	const savings = budgetTransactions
		.filter((transaction) => transaction.type === "savings")
		.reduce((total, transaction) => total + transaction.amount, 0);

	const used = expenses - income - savings;
	const remaining = budget.amount - used;
	const isOver = remaining < 0;
	const usedPercent = budget.amount > 0 ? (used / budget.amount) * 100 : 0;
	const barPercent = Math.min(100, Math.max(0, usedPercent));
	const barColor =
		isOver || (budget.flow === "expense" && usedPercent >= 80) ? "bg-red-400" : "bg-primary";

	const daysLeft = budget.targetDate
		? Math.max(0, differenceInCalendarDays(parseISO(budget.targetDate), new Date()) + 1)
		: null;

	const settings = await getSettings();

	return (
		<div className="flex w-full flex-col gap-6">
			<header className="flex flex-col gap-1">
				<div className="flex flex-col items-start gap-2">
					<h1 className="text-2xl font-bold">{budget.name}</h1>
					<BudgetSubtitle budget={budget} format={settings.dateFormat} />
					<p
						style={{
							color: budget.category.color,
						}}
					>
						{budget.category.name}
					</p>
				</div>
			</header>

			<section className="rounded-xl bg-card p-5">
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
					<div>
						<p className="text-sm font-medium text-muted-foreground">Goal</p>

						<p className="mt-1 text-2xl tabular-nums">{formatAmount(budget.amount)}</p>
					</div>

					<div>
						<p className={`text-sm font-medium ${getTextColor(budget.flow)}`}>
							{capitalize(budget.flow)}
						</p>

						<p className={`mt-1 text-2xl tabular-nums ${getTextColor(budget.flow)}`}>
							{formatAmount(Math.max(0, used))}
						</p>

						<p className="mt-1 text-sm text-muted-foreground">
							{Math.round(Math.max(0, usedPercent))}% used
						</p>
					</div>

					<div>
						<p className="text-sm font-medium text-muted-foreground">
							{isOver ? "Over budget" : "Left"}
						</p>

						<p className={`mt-1 text-2xl tabular-nums ${isOver ? "text-red-400" : ""}`}>
							{formatAmount(Math.abs(remaining))}
						</p>

						{!isOver && (
							<p className="mt-1 text-sm text-muted-foreground">
								{Math.round(Math.max(0, 100 - usedPercent))}% remaining
							</p>
						)}
					</div>
				</div>

				<div className="mt-6">
					<div
						className="h-2 w-full overflow-hidden rounded-full bg-background"
						role="progressbar"
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={Math.round(barPercent)}
						aria-label="Budget progress"
					>
						<div
							className={`h-full rounded-full ${barColor}`}
							style={{ width: `${barPercent}%` }}
						/>
					</div>

					{daysLeft !== null && (
						<div className="mt-2 flex justify-between text-sm text-muted-foreground">
							<span>{Math.round(Math.max(0, usedPercent))}% used</span>

							<span>
								{daysLeft} {daysLeft === 1 ? "day" : "days"} left
							</span>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}

function BudgetSubtitle({
	budget,
	format,
}: {
	budget: typeof budgetSchema.$inferSelect;
	format: string;
}) {
	if (budget.type === "manual") {
		return (
			<p className="text-sm text-muted-foreground">
				{formatDate(budget.startDate, format)} –{" "}
				{budget.targetDate && formatDate(budget.targetDate, format)}
			</p>
		);
	}

	return (
		<p className="text-sm text-muted-foreground">
			{typeLabels[budget.type]}
			{budget.interval ? `, ${intervalLabels[budget.interval].toLowerCase()}` : ""}
		</p>
	);
}
