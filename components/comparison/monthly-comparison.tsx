import { TotalsRows } from "@/components/comparison/comparison-total-rows";
import TransactionAmount from "@/components/transactions/components/transaction-amount";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { buildComparisonTable, getRawTransactionsAndCategories } from "./comparison-data";

const MONTH_LABELS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

async function getMonthlyComparisonData(year: number) {
	const { transactions, categories } = await getRawTransactionsAndCategories();

	const filtered = transactions.filter(
		(t) => t.datetime && new Date(t.datetime).getFullYear() === year,
	);

	const months = Array.from({ length: 12 }, (_, i) => i + 1);

	const { categories: categoryRows, totals } = buildComparisonTable(
		filtered,
		categories,
		(datetime) => new Date(datetime).getMonth() + 1,
		months,
	);

	return { months, categories: categoryRows, totals };
}

export default async function MonthlyComparison({
	searchParams,
}: {
	searchParams: Promise<{ year?: string }>;
}) {
	const { year: yearParam } = await searchParams;
	const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

	const { months, categories, totals } = await getMonthlyComparisonData(year);

	return (
		<div className="w-full overflow-x-auto">
			<Table className="w-full border-collapse border border-border">
				<TableHeader>
					<TableRow>
						<TableHead className="border border-border p-3 text-left">Category</TableHead>
						{months.map((m) => (
							<TableHead key={m} className="border border-border p-3 text-center">
								{MONTH_LABELS[m - 1]}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					<TotalsRows totals={totals} />
					<TableRow className="bg-border">
						<TableCell colSpan={months.length + 1} />
					</TableRow>
					{categories.map((category) => (
						<TableRow key={category.id} className="hover:bg-card">
							<TableCell className="border border-border p-3 font-medium">
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 rounded" style={{ backgroundColor: category.color }} />
									{category.name}
								</div>
							</TableCell>
							{category.amounts.map((amount, idx) => (
								<TableCell key={idx} className="border border-border p-3 text-right">
									<TransactionAmount amount={amount} type="expense" />
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
