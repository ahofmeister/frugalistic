import { dbTransaction } from "@/db";
import { categories, transactionSchema } from "@/db/migrations/schema";
import type { TransactionType } from "@/types";

export interface CategoryRow {
	id: string;
	name: string;
	color: string;
	amounts: number[];
	type: TransactionType;
}

export interface TotalsRow {
	label: string;
	amounts: number[];
	type: TransactionType;
	percentages?: number[];
}

export async function getRawTransactionsAndCategories() {
	const [transactions, cats] = await Promise.all([
		dbTransaction((tx) => tx.select().from(transactionSchema)),
		dbTransaction((tx) => tx.select().from(categories)),
	]);
	return { transactions, categories: cats };
}

export function buildComparisonTable(
	transactions: Awaited<ReturnType<typeof getRawTransactionsAndCategories>>["transactions"],
	categories: Awaited<ReturnType<typeof getRawTransactionsAndCategories>>["categories"],
	getKey: (datetime: string) => number | null,
	keys: number[],
): { categories: CategoryRow[]; totals: TotalsRow[] } {
	const pivot: Record<string, { name: string; color: string; years: Record<number, number> }> = {};
	const totals: Record<string, Record<number, number>> = { income: {}, savings: {} };
	const fixedExpenses: Record<number, number> = {};

	categories.forEach((cat) => {
		pivot[cat.id] = { name: cat.name, color: cat.color, years: {} };
	});

	transactions.forEach((t) => {
		if (!t.datetime) return;
		const key = getKey(t.datetime);
		if (key === null) return;

		if (t.type === "income" || t.type === "savings") {
			totals[t.type][key] = (totals[t.type][key] || 0) + t.amount;
		}

		if (t.type === "expense" && t.category) {
			if (!pivot[t.category]) pivot[t.category] = { name: "", color: "", years: {} };
			pivot[t.category].years[key] = (pivot[t.category].years[key] || 0) + t.amount;

			if (t.costType === "fixed") {
				fixedExpenses[key] = (fixedExpenses[key] || 0) + t.amount;
			}
		}
	});

	const expenseTotals: Record<number, number> = {};
	Object.values(pivot).forEach((cat) => {
		Object.entries(cat.years).forEach(([k, amount]) => {
			expenseTotals[Number(k)] = (expenseTotals[Number(k)] || 0) + amount;
		});
	});

	const incomeAmounts = keys.map((k) => totals.income[k] || 0);
	const savingsAmounts = keys.map((k) => totals.savings[k] || 0);
	const expenseAmounts = keys.map((k) => expenseTotals[k] || 0);

	const savingsPercentages = savingsAmounts.map((s, i) =>
		incomeAmounts[i] > 0 ? (s / incomeAmounts[i]) * 100 : 0,
	);
	const fixedExpensePercentages = expenseAmounts.map((total, i) => {
		const fixed = fixedExpenses[keys[i]] || 0;
		return total > 0 ? (fixed / total) * 100 : 0;
	});

	const totalsRows: TotalsRow[] = [
		{ label: "Income", amounts: incomeAmounts, type: "income" },
		{ label: "Savings", amounts: savingsAmounts, type: "savings", percentages: savingsPercentages },
		{
			label: "Total Expense",
			amounts: expenseAmounts,
			type: "expense",
			percentages: fixedExpensePercentages,
		},
	];

	const categoryRows: CategoryRow[] = Object.entries(pivot)
		.filter(([, cat]) => Object.keys(cat.years).length > 0)
		.map(([id, cat]) => ({
			id,
			name: cat.name,
			color: cat.color,
			amounts: keys.map((k) => cat.years[k] || 0),
			type: "expense" as TransactionType,
		}))
		.sort((a, b) => a.name.localeCompare(b.name));

	return { categories: categoryRows, totals: totalsRows };
}
