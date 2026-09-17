import { endOfMonth, format, startOfMonth } from "date-fns";
import { and, eq, gte, isNull, lte, or, sql } from "drizzle-orm";
import { formatAmount } from "@/components/transactions/components/transaction-amount";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dbTransaction } from "@/drizzle/client";
import { budgetSchema, categories, transactions } from "@/drizzle/schema";
import { capitalize } from "@/lib/utils";

export async function BudgetList({ year, month }: { year: number; month: number }) {
	const periodDate = new Date(year, month, 1);
	const startOfMonthStr = format(startOfMonth(periodDate), "yyyy-MM-dd");
	const endOfMonthStr = format(endOfMonth(periodDate), "yyyy-MM-dd");

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
					gte(transactions.datetime, startOfMonthStr),
					lte(transactions.datetime, endOfMonthStr),
				),
			)
			.where(
				or(
					and(
						eq(budgetSchema.type, "manual"),
						lte(budgetSchema.startDate, endOfMonthStr),
						or(isNull(budgetSchema.targetDate), gte(budgetSchema.targetDate, startOfMonthStr)),
					),
					and(
						eq(budgetSchema.type, "recurring"),
						eq(budgetSchema.interval, "monthly"),
						lte(budgetSchema.startDate, endOfMonthStr),
					),
					and(
						eq(budgetSchema.type, "recurring"),
						eq(budgetSchema.interval, "annually"),
						lte(budgetSchema.startDate, endOfMonthStr),
						sql`EXTRACT(MONTH FROM ${budgetSchema.startDate}) = ${month + 1}`,
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
					<Card key={budget.id}>
						<CardHeader>
							<CardTitle className="flex justify-between">
								<p style={{ color: category?.color }}>{budget.name}</p>
								<p>
									{formatAmount(transactionAmount)} / {formatAmount(budget.amount)}
								</p>
							</CardTitle>
							<CardDescription style={{ color: category?.color }}>{category?.name}</CardDescription>
						</CardHeader>

						<CardContent className="text-sm text-gray-400 flex justify-between">
							<p>{capitalize(budget.interval)}</p>
						</CardContent>
					</Card>
				);
			})}
		</ol>
	);
}
