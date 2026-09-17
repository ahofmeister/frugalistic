import { endOfMonth, endOfYear, format, startOfMonth, startOfYear } from "date-fns";
import { and, eq, gte, lte, or, sql } from "drizzle-orm";
import Link from "next/link";
import { formatAmount } from "@/components/transactions/components/transaction-amount";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dbTransaction } from "@/drizzle/client";
import { budgetSchema, categories, transactions } from "@/drizzle/schema";
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
	const startOfYearStr = format(startOfYear(periodDate), "yyyy-MM-dd");
	const endOfYearStr = format(endOfYear(periodDate), "yyyy-MM-dd");

	const rows = await dbTransaction((tx) => {
		return tx
			.select({
				budget: budgetSchema,
				category: categories,
				transactionAmount: sql<number>`coalesce(sum(${transactions.amount}), 0)`,
			})
			.from(budgetSchema)
			.innerJoin(categories, eq(budgetSchema.categoryId, categories.id))
			.leftJoin(
				transactions,
				and(
					eq(transactions.categoryId, budgetSchema.categoryId),
					gte(
						transactions.datetime,
						sql`CASE
                            WHEN ${budgetSchema.type} = 'manual' THEN ${budgetSchema.startDate}
						WHEN ${budgetSchema.type} = 'year' THEN ${startOfYearStr}
						ELSE ${startOfMonthStr}
						END`,
					),
					lte(
						transactions.datetime,
						sql`CASE
                            WHEN ${budgetSchema.type} = 'manual' THEN ${budgetSchema.targetDate}
						WHEN ${budgetSchema.type} = 'year' THEN ${endOfYearStr}
						ELSE ${endOfMonthStr}
						END`,
					),
				),
			)
			.where(
				or(
					and(
						eq(budgetSchema.type, "manual"),
						gte(budgetSchema.targetDate, startOfMonthStr),
						lte(budgetSchema.startDate, endOfMonthStr),
					),
					and(
						eq(budgetSchema.type, "month"),
						sql`${budgetSchema.interval} IS NULL`,
						sql`EXTRACT(YEAR FROM ${budgetSchema.startDate}) = ${year}`,
						sql`EXTRACT(MONTH FROM ${budgetSchema.startDate}) = ${month + 1}`,
					),
					and(
						eq(budgetSchema.type, "month"),
						eq(budgetSchema.interval, "monthly"),
						lte(budgetSchema.startDate, endOfMonthStr),
					),
					and(
						eq(budgetSchema.type, "month"),
						eq(budgetSchema.interval, "annually"),
						lte(budgetSchema.startDate, endOfMonthStr),
						sql`EXTRACT(MONTH FROM ${budgetSchema.startDate}) = ${month + 1}`,
					),
					and(
						eq(budgetSchema.type, "year"),
						sql`${budgetSchema.interval} IS NULL`,
						sql`EXTRACT(YEAR FROM ${budgetSchema.startDate}) = ${year}`,
					),
					and(
						eq(budgetSchema.type, "year"),
						eq(budgetSchema.interval, "annually"),
						lte(budgetSchema.startDate, endOfYearStr),
					),
				),
			)
			.groupBy(budgetSchema.id, categories.id)
			.orderBy(sql`lower(${budgetSchema.name}) asc`);
	});

	if (rows.length === 0) {
		return <p className="text-sm text-gray-400">No budgets for this period.</p>;
	}

	return (
		<ol className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2 lg:grid-cols-4">
			{rows.map(({ budget, category, transactionAmount }) => {
				return (
					<Link key={budget.id} href={`/budgets/${budget.id}`}>
						<Card className="h-full">
							<CardHeader>
								<CardTitle className="flex justify-between">
									<p style={{ color: category?.color }}>{budget.name}</p>
									<p>
										{formatAmount(transactionAmount)} / {formatAmount(budget.amount)}
									</p>
								</CardTitle>
								<CardDescription style={{ color: category?.color }}>
									{category?.name}
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
