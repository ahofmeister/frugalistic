import type { TransactionTypeWithLeftover } from "@/drizzle/schema";

export function getTextColor(type: TransactionTypeWithLeftover | undefined | null) {
	switch (type) {
		case "savings":
			return "text-savings";
		case "expense":
			return "text-expense";
		case "income":
			return "text-income";
		case "leftover":
			return "text-leftover";
	}
}

export function getBgColor(type: TransactionTypeWithLeftover | undefined) {
	switch (type) {
		case "savings":
			return "bg-savings";
		case "expense":
			return "bg-expense";
		case "income":
			return "bg-income";
		case "leftover":
			return "bg-leftover";
	}
}
