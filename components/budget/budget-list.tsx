import { endOfMonth, endOfYear, format, startOfMonth, startOfYear } from "date-fns";
import { and, eq, gte, inArray, lte } from "drizzle-orm";
import Link from "next/link";
import { getActiveAccountId } from "@/components/account/account-actions";
import { getBudgetDateRange } from "@/components/budget/budget-helper";
import { formatAmount } from "@/components/transactions/components/transaction-amount";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dbTransaction } from "@/drizzle/client";
import { transactions } from "@/drizzle/schema";
import { capitalize } from "@/lib/utils";

export async function BudgetList({
	yearPromise,
	monthPromise,
}: {
	yearPromise: Promise<number>;
	monthPromise: Promise<number>;
}) {
	const year = await yearPromise;
	const month = await monthPromise;
	const periodDate = new Date(year, month, 1);
	const startOfMonthStr = format(startOfMonth(periodDate), "yyyy-MM-dd");
	const endOfMonthStr = format(endOfMonth(periodDate), "yyyy-MM-dd");
	const endOfYearStr = format(endOfYear(periodDate), "yyyy-MM-dd");

	const activeAccountId = await getActiveAccountId();

	const activeBudgets = await dbTransaction((tx) => {
		return tx.query.budgetSchema.findMany({
			where: {
				accountId: activeAccountId,
				OR: [
					{
						type: "manual",
						targetDate: { gte: startOfMonthStr },
						startDate: { lte: endOfMonthStr },
					},
					{
						type: "month",
						interval: "monthly",
						startDate: { lte: endOfMonthStr },
					},
					{
						type: "year",
						interval: "annually",
						startDate: { lte: endOfYearStr },
					},
				],
			},
			orderBy: { name: "asc" },
			with: {
				category: true,
			},
		});
	});

	if (activeBudgets.length === 0) {
		return <p className="text-sm text-gray-400">No budgets for this period.</p>;
	}

	const categoryIds = Array.from(new Set(activeBudgets.map((b) => b.categoryId)));

	const periods = activeBudgets.map((b) => getBudgetDateRange(b, { year, month }));
	const widestStart = periods.reduce((min, p) => (p.start < min ? p.start : min), periods[0].start);
	const widestEnd = periods.reduce((max, p) => (p.end > max ? p.end : max), periods[0].end);

	const candidateTransactions = await dbTransaction((tx) => {
		return tx
			.select({
				categoryId: transactions.categoryId,
				amount: transactions.amount,
				datetime: transactions.datetime,
			})
			.from(transactions)
			.where(
				and(
					eq(transactions.accountId, activeAccountId),
					inArray(transactions.categoryId, categoryIds),
					gte(transactions.datetime, widestStart),
					lte(transactions.datetime, widestEnd),
				),
			);
	});

	const amountByBudgetId = new Map(
		activeBudgets.map((budget) => {
			const { start, end } = getBudgetDateRange(budget, { year, month });
			const sum = candidateTransactions
				.filter(
					(t) => t.categoryId === budget.categoryId && t.datetime >= start && t.datetime <= end,
				)
				.reduce((acc, t) => acc + t.amount, 0);
			return [budget.id, sum];
		}),
	);

	return (
		<ol className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2 lg:grid-cols-4">
			{activeBudgets.map((budget) => {
				const transactionAmount = amountByBudgetId.get(budget.id) ?? 0;
				return (
					<Link key={budget.id} href={`/budgets/${budget.id}`}>
						<Card className="h-full">
							<CardHeader>
								<CardTitle className="flex justify-between">
									<p style={{ color: budget.category?.color }}>{budget.name}</p>
									<p>
										{formatAmount(transactionAmount)} / {formatAmount(budget.amount)}
									</p>
								</CardTitle>
								<CardDescription style={{ color: budget.category?.color }}>
									{budget.category?.name}
								</CardDescription>
							</CardHeader>

							<CardContent className="text-sm text-gray-400 flex justify-between">
								<p>{budget.interval ? capitalize(budget.interval) : capitalize(budget.type)}</p>
							</CardContent>
						</Card>
					</Link>
				);
			})}
		</ol>
	);
}
