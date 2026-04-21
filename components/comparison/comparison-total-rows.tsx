import TransactionAmount from "@/components/transactions/components/transaction-amount";
import { TableCell, TableRow } from "@/components/ui/table";
import type { TotalsRow } from "./comparison-data";

export function TotalsRows({ totals }: { totals: TotalsRow[] }) {
	return totals.map((total) => (
		<TableRow key={total.label} className="bg-card font-semibold">
			<TableCell className="border border-border p-3">{total.label}</TableCell>
			{total.amounts.map((amount, index) => (
				<TableCell key={index} className="border border-border p-3 text-right">
					<div className="flex flex-col items-end gap-1">
						<TransactionAmount amount={amount} type={total.type} />
						{total.type === "savings" && total.percentages && (
							<span className="text-xs text-muted-foreground">
								{total.percentages[index].toFixed(1)}% of income
							</span>
						)}
						{total.type === "expense" && total.percentages && (
							<span className="text-xs text-muted-foreground">
								{total.percentages[index].toFixed(1)}% fixed
							</span>
						)}
					</div>
				</TableCell>
			))}
		</TableRow>
	));
}
