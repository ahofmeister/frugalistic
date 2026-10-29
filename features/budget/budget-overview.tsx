import { differenceInCalendarDays, parseISO } from "date-fns";
import { notFound } from "next/navigation";
import { validate } from "uuid";
import { findBudgetById, findBudgetTransactions } from "@/features/budget/budget-actions";
import { getBudgetDateRange } from "@/features/budget/budget-helper";
import { BudgetSubtitle } from "@/features/budget/budget-subtitle";
import DeleteBudget from "@/features/budget/delete-budget";
import { getTextColor } from "@/features/transactions/colors";
import DisplayAmount from "@/features/transactions/components/display-amount";
import { capitalize } from "@/lib/utils";

export async function BudgetOverview({ budgetId }: { budgetId: Promise<string> }) {
	const id = await budgetId;

	if (!validate(id)) {
		return notFound();
	}

	const budget = await findBudgetById(id);

	if (!budget) {
		notFound();
	}

	const actualBudgetPeriod = getBudgetDateRange(budget, {
		month: new Date().getMonth(),
		year: new Date().getFullYear(),
	});

	const budgetTransactions = await findBudgetTransactions(
		budget.categoryId,
		actualBudgetPeriod.start,
		actualBudgetPeriod.end,
	);

	const signedAmount = (transaction: (typeof budgetTransactions)[number]) =>
		transaction.type === "expense" ? transaction.amount : -transaction.amount;

	const bookedUsed = budgetTransactions
		.filter((transaction) => transaction.status === "booked")
		.reduce((total, transaction) => total + signedAmount(transaction), 0);

	const plannedUsed = budgetTransactions
		.filter((transaction) => transaction.status === "planned")
		.reduce((total, transaction) => total + signedAmount(transaction), 0);

	const remaining = budget.amount - bookedUsed - plannedUsed;
	const isOver = remaining < 0;

	const bookedPercent =
		budget.amount > 0 ? Math.min(100, Math.max(0, (bookedUsed / budget.amount) * 100)) : 0;
	const plannedPercent =
		budget.amount > 0
			? Math.min(100 - bookedPercent, Math.max(0, (plannedUsed / budget.amount) * 100))
			: 0;

	const daysLeft = Math.max(
		0,
		differenceInCalendarDays(parseISO(actualBudgetPeriod.end), new Date()) + 1,
	);

	return (
		<div className="flex w-full flex-col gap-6">
			<header className="flex flex-col gap-1">
				<div className="flex items-center justify-between">
					<div className="flex flex-col items-start gap-2">
						<h1 className="text-2xl font-bold">{budget.name}</h1>
						<BudgetSubtitle budget={budget} />
						<p
							style={{
								color: budget.category.color,
							}}
						>
							{budget.category.name}
						</p>
					</div>

					{budget && <DeleteBudget id={budget.id} />}
				</div>
			</header>
			<section className="flex flex-col gap-5 rounded-xl bg-card p-5">
				<div className="flex flex-col gap-2">
					<div
						className="flex h-2 w-full overflow-hidden rounded-full bg-background"
						role="progressbar"
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={Math.round(bookedPercent + plannedPercent)}
						aria-label="Budget progress"
					>
						<div
							className="h-full"
							style={{ backgroundColor: budget.category.color, width: `${bookedPercent}%` }}
						/>
						<div
							className="h-full bg-[repeating-linear-gradient(45deg,currentColor_0,currentColor_3px,transparent_3px,transparent_6px)]"
							style={{ width: `${plannedPercent}%`, color: budget.category.color }}
						/>
					</div>

					<div className="flex justify-between text-sm text-muted-foreground">
						<span>{Math.round(bookedPercent)}% booked</span>
						<span>
							{daysLeft} {daysLeft === 1 ? "day" : "days"} left
						</span>
					</div>
				</div>

				<dl className="flex flex-col gap-3 tabular-nums">
					<div className="flex items-center justify-between">
						<dt className="text-muted-foreground">Goal</dt>
						<dd>
							<DisplayAmount amount={budget.amount} />
						</dd>
					</div>

					<div className="flex items-center justify-between">
						<dt className="flex items-center gap-2">
							<span
								className="h-3 w-3 rounded-sm"
								style={{ backgroundColor: budget.category.color }}
							/>
							<span className={getTextColor(budget.flow)}>{capitalize(budget.flow)} booked</span>
						</dt>
						<dd className={getTextColor(budget.flow)}>
							<DisplayAmount amount={Math.max(0, bookedUsed)} />
						</dd>
					</div>

					{plannedUsed !== 0 && (
						<div className="flex items-center justify-between">
							<dt className="flex items-center gap-2">
								<span
									className="h-3 w-3 rounded-sm bg-[repeating-linear-gradient(45deg,currentColor_0,currentColor_2px,transparent_2px,transparent_4px)]"
									style={{ color: budget.category.color }}
								/>
								<span className={getTextColor(budget.flow)}>Planned</span>
							</dt>
							<dd className={getTextColor(budget.flow)}>
								<DisplayAmount amount={plannedUsed} />
							</dd>
						</div>
					)}

					<div className="flex items-center justify-between border-t border-border pt-3">
						<dt className="font-medium">{isOver ? "Over budget" : "Left"}</dt>
						<dd className={`text-xl font-medium ${isOver ? "text-red-400" : ""}`}>
							<DisplayAmount amount={remaining} />
						</dd>
					</div>
				</dl>
			</section>
		</div>
	);
}
