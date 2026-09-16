import { sql } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import { MonthYearStepperPeriod } from "@/app/(dashboard)/budgets/monthYearStepperPeriod";
import { formatAmount } from "@/components/transactions/components/transaction-amount";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dbTransaction } from "@/drizzle/client";
import { capitalize } from "@/lib/utils";

async function BudgetList() {
	const budgets = await dbTransaction((tx) => {
		return tx.query.budgetSchema.findMany({
			with: {
				category: true,
			},
			orderBy: (t) => sql`lower(${t.name}) asc`,
		});
	});
	return (
		<ol className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2 lg:grid-cols-4">
			{budgets.map((budget) => {
				return (
					<Card key={budget.id}>
						<CardHeader>
							<CardTitle className="flex justify-between">
								<p style={{ color: budget.category.color }}>{budget.name}</p>
								<p>{formatAmount(budget.amount)}</p>
							</CardTitle>
							<CardDescription style={{ color: budget.category.color }}>
								{budget.category.name}
							</CardDescription>
						</CardHeader>

						<CardContent className="text-sm text-gray-400 flex justify-between ">
							<p>{capitalize(budget.interval ?? "-")}</p>
							<p>{capitalize(budget.type)}</p>
						</CardContent>
					</Card>
				);
			})}
		</ol>
	);
}

export default function BudgetsPage() {
	return (
		<div className="space-y-6 ">
			<div className="flex justify-between items-center">
				<div className="text-2xl font-semibold">Budgets</div>
				<Link href="/budgets/new">
					<Button>Create</Button>
				</Link>
			</div>

			<MonthYearStepperPeriod />

			<Suspense>
				<BudgetList />
			</Suspense>
		</div>
	);
}
