import { CircleSlash2 } from "lucide-react";
import type { TransactionType } from "@/drizzle/schema";
import TransactionAmount from "@/features/transactions/components/transaction-amount";

export function AverageAmount(props: { amount: number; type?: TransactionType }) {
	return (
		<div className="flex gap-x-1 items-center">
			<CircleSlash2 size="14" />
			<TransactionAmount amount={props.amount} type={props.type} />
		</div>
	);
}
