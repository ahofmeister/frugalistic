import { TotalsRows } from "@/features/comparison/comparison-total-rows";
import CategoryNameColor from "@/features/transactions/components/category-name-color";
import DisplayAmount from "@/features/transactions/components/display-amount";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/features/ui/table";
import { buildComparisonTable, getRawTransactionsAndCategories } from "./comparison-data";

async function getAnnualComparisonData() {
	const { transactions, categories } = await getRawTransactionsAndCategories();

	const years = Array.from(
		new Set(
			transactions.filter((t) => !!t.datetime).map((t) => new Date(t.datetime).getFullYear()),
		),
	).sort((a, b) => b - a);

	const { categories: categoryRows, totals } = buildComparisonTable(
		transactions,
		categories,
		(datetime) => new Date(datetime).getFullYear(),
		years,
	);

	return { columns: years.map(String), categories: categoryRows, totals };
}

export default async function AnnualComparison() {
	const { columns, categories, totals } = await getAnnualComparisonData();

	return (
		<div className="w-full overflow-x-auto">
			<Table className="w-full border-collapse border border-border">
				<TableHeader>
					<TableRow>
						<TableHead className="border border-border p-3 text-left">Category</TableHead>
						{columns.map((col) => (
							<TableHead key={col} className="border border-border p-3 text-center">
								{col}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					<TotalsRows totals={totals} showAverage />
					<TableRow className="bg-border">
						<TableCell colSpan={columns.length + 1} />
					</TableRow>
					{categories.map((category) => (
						<TableRow key={category.id} className="hover:bg-card">
							<TableCell className="border border-border p-3 font-medium">
								<CategoryNameColor name={category.name} color={category.color} />
							</TableCell>
							{category.amounts.map((amount, idx) => (
								<TableCell key={idx} className="border border-border p-3 text-right">
									<DisplayAmount amount={amount} type="expense" />
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
