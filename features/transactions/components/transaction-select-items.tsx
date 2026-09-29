import { getBgColor } from "@/features/transactions/colors";
import { SelectItem } from "@/features/ui/select";
import { transactionTypes } from "@/drizzle/schema";
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
