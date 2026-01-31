import { CircleSlash2 } from "lucide-react";

import TransactionAmount from "@/components/transactions/components/transaction-amount";
import type { TransactionType } from "@/types";

export function AverageAmount(props: { amount: number; type?: TransactionType }) {
	return (
		<div className="flex gap-x-1 items-center">
			<CircleSlash2 size="14" />
			<TransactionAmount amount={props.amount} type={props.type} />
		</div>
	);
}
