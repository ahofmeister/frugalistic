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
export type TransactionType =
  | Database["public"]["Enums"]["transaction_type"]
  | null;

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

// Onboarding
export type DefaultCategory =
  Database["public"]["Tables"]["default_categories"]["Row"];

export type OnboardingStep =
  Database["public"]["Tables"]["onboarding_steps"]["Row"];

// User
export type Profile = Database["public"]["Tables"]["profile"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["profile"]["Update"];
