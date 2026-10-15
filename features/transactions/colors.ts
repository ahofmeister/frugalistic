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

export const categoryColours = [
	"#ef4444",
	"#f97316",
	"#f59e0b",
	"#eab308",
	"#84cc16",
	"#22c55e",
	"#14b8a6",
	"#06b6d4",
	"#3b82f6",
	"#6366f1",
	"#8b5cf6",
	"#d946ef",
	"#ec4899",
	"#64748b",
] as const;

export type CategoryColour = (typeof categoryColours)[number];

export const defaultCategoryColours: CategoryColour = categoryColours[0];
