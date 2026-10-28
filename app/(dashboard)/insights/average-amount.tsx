import { CircleSlash2 } from "lucide-react";
import type { TransactionType } from "@/drizzle/schema";
import DisplayAmount from "@/features/transactions/components/display-amount";

export function AverageAmount(props: { amount: number; type?: TransactionType }) {
	return (
		<div className="flex gap-x-1 items-center">
			<CircleSlash2 size="14" />
			<DisplayAmount amount={props.amount} type={props.type} />
		</div>
	);
}
