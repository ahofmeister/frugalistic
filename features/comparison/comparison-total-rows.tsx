import { CircleSlash2Icon } from "lucide-react";
import TransactionAmount from "@/features/transactions/components/transaction-amount";
import { TableCell, TableRow } from "@/features/ui/table";
import type { TotalsRow } from "./comparison-data";

const MONTHS_PER_YEAR = 12;

export function TotalsRows({
	totals,
	showAverage,
}: {
	totals: TotalsRow[];
	showAverage?: boolean;
}) {
	return totals.map((total) => (
		<TableRow key={total.label} className="bg-card font-semibold">
			<TableCell className="border border-border p-3">{total.label}</TableCell>
			{total.amounts.map((amount, index) => (
				<TableCell key={index} className="border border-border p-3 text-right">
					<div className="flex flex-col items-end gap-1">
						<TransactionAmount amount={amount} type={total.type} />
						{showAverage && (
							<span className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
								<CircleSlash2Icon size={10} />
								<TransactionAmount
									amount={Math.round(amount / MONTHS_PER_YEAR)}
									type={total.type}
								/>
								/ month
							</span>
						)}
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
