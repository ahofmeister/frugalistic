import { getBgColor } from "@/components/transactions/components/transaction-amount";
import { SelectItem } from "@/components/ui/select";
import { transactionTypes } from "@/lib/transaction-types";
import { capitalize } from "@/lib/utils";

export function TransactionSelectItems() {
	return transactionTypes.map((type) => (
		<SelectItem key={type} value={type}>
			<div className="flex gap-x-2 items-center">
				<span className={`w-3 h-3 rounded-full ${getBgColor(type)}`}></span>
				<span>{capitalize(type)}</span>
			</div>
		</SelectItem>
	));
}
