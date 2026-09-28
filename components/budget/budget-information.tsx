import {
	addDays,
	addMonths,
	addYears,
	differenceInCalendarDays,
	format,
	formatDate,
	isAfter,
	parseISO,
} from "date-fns";
import { and, desc, eq, gte, inArray, lt } from "drizzle-orm";
import { notFound } from "next/navigation";
import { validate } from "uuid";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import { getActiveAccountId } from "@/components/account/account-actions";
import { findBudgetById } from "@/components/budget/budget-actions";
import { getTextColor } from "@/components/transactions/colors";
import { formatAmount } from "@/components/transactions/components/transaction-amount";
import TransactionList from "@/components/transactions/components/transaction-list";
import { dbTransaction } from "@/drizzle/client";
import { type budgetSchema, categories, transactionsRecurring } from "@/drizzle/schema";
import { transactions } from "@/drizzle/schema/transaction-schema";
import { capitalize, DB_DATE_FORMAT } from "@/lib/utils";

const typeLabels = {
	month: "Monthly budget",
	year: "Yearly budget",
	manual: "Custom budget",
} as const;

const intervalLabels = {
	monthly: "Every month",
	annually: "Every year",
} as const;

function getPeriod(
	startDate: string,
	interval: string | null,
	targetDate: string | null,
	now: Date,
) {
	const start = parseISO(startDate);

	if (!interval) {
		return targetDate ? { start, end: parseISO(targetDate), endInclusive: true } : null;
	}

	const step = interval === "annually" ? addYears : addMonths;
	let index = 1;
	let periodStart = start;
	let periodEnd = step(start, index);

	while (!isAfter(periodEnd, now)) {
		index += 1;
		periodStart = periodEnd;
		periodEnd = step(start, index);
	}

	return {
		start: periodStart,
		end: periodEnd,
		endInclusive: false,
	};
}

async function findBudgetTransactions(params: { categoryId: string; from: Date; to: Date | null }) {
	const activeAccountId = await getActiveAccountId();

	const conditions = [
		eq(transactions.categoryId, params.categoryId),
		eq(transactions.accountId, activeAccountId),
		inArray(transactions.type, ["expense", "income", "savings"]),
		gte(transactions.datetime, format(params.from, DB_DATE_FORMAT)),
	];

	if (params.to) {
		conditions.push(lt(transactions.datetime, format(params.to, DB_DATE_FORMAT)));
	}

	return dbTransaction(async (tx) => {
		const rows = await tx
			.select({
				transaction: transactions,
				category: categories,
				recurringTransaction: transactionsRecurring,
			})
			.from(transactions)
			.innerJoin(categories, eq(transactions.categoryId, categories.id))
			.leftJoin(
				transactionsRecurring,
				eq(transactions.recurringTransactionId, transactionsRecurring.id),
			)
			.where(and(...conditions))
			.orderBy(desc(transactions.datetime), desc(transactions.createdAt));

		return rows.map(({ transaction, category, recurringTransaction }) => ({
			...transaction,
			category,
			recurringTransaction,
		}));
	});
}

export async function BudgetInformation(props: { budgetId: Promise<string> }) {
	const budgetId = await props.budgetId;

	if (!validate(budgetId)) {
		return notFound();
	}

	const budget = await findBudgetById(budgetId);

	if (!budget) {
		notFound();
	}

	const now = new Date();

	const period = getPeriod(budget.startDate, budget.interval, budget.targetDate, now);

	const rangeStart = period?.start ?? parseISO(budget.startDate);
	const rangeEnd = period ? (period.endInclusive ? addDays(period.end, 1) : period.end) : null;

	const budgetTransactions = await findBudgetTransactions({
		categoryId: budget.categoryId,
		from: rangeStart,
		to: rangeEnd,
	});

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

	const daysLeft = period ? Math.max(0, differenceInCalendarDays(period.end, now)) : null;

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

			<section className="flex flex-col gap-3">
				<h2 className="text-lg font-medium">Transactions</h2>

				<TransactionList transactions={budgetTransactions} dateFormat={settings.dateFormat} />
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
