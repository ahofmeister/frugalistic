import { Database } from "./supabase";

// Transactions
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type NewTransaction = Omit<
  Database["public"]["Tables"]["transactions"]["Insert"],
  "user_id"
>;
export type TransactionWithCategory = Transaction & {
  category: Category;
};
export type TransactionType = Database["public"]["Enums"]["transaction_type"];

export type Division = Database["public"]["Enums"]["division"];

export type TransactionWithRecurring = Transaction & {
  recurring_transaction: RecurringTransaction;
  category: Category;
};

export type TransactionAutoSuggest =
  Database["public"]["Views"]["transaction_auto_suggest2"]["Row"];

// Recurring Transactions
export type RecurringInterval =
  Database["public"]["Enums"]["recurring_interval"];
export type NewRecurringTransaction =
  Database["public"]["Tables"]["transactions_recurring"]["Insert"];
export type RecurringTransaction =
  Database["public"]["Tables"]["transactions_recurring"]["Row"];

// Category
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type NewCategory = Database["public"]["Tables"]["categories"]["Insert"];

// User
export type Profile = Database["public"]["Tables"]["profile"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["profile"]["Update"];
