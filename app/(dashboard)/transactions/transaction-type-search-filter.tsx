"use client";
import { createParser, useQueryState } from "nuqs";
import { useTransition } from "react";
import { TransactionSelectItems } from "@/components/transactions/components/transaction-select-items";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { TransactionType } from "@/types";

const TYPE_ALL_VALUE = "all";

const parseTransactionTypeFilter = createParser({
	parse(value) {
		if (value === "income" || value === "expense" || value === "savings") {
			return value as TransactionType;
		}
		return "all";
	},
	serialize(value) {
		return value;
	},
})
	.withDefault("all")
	.withOptions({ shallow: false });

const TransactionTypeSearchFilter = () => {
	const [type, setType] = useQueryState("type", parseTransactionTypeFilter);
	const [isPending, startTransition] = useTransition();

	return (
		<div>
			<Select
				value={type}
				onValueChange={(value) => {
					startTransition(async () => {
						await setType(value === TYPE_ALL_VALUE ? null : (value as TransactionType));
					});
				}}
				disabled={isPending}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select a type" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={TYPE_ALL_VALUE}>Select Type</SelectItem>
					<TransactionSelectItems />
				</SelectContent>
			</Select>
		</div>
	);
};

export default TransactionTypeSearchFilter;
