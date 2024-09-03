import { Database } from "./supabase";

export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type NewTransaction = Omit<
  Database["public"]["Tables"]["transactions"]["Insert"],
  "user_id"
>;
export type TransactionType =
  | Database["public"]["Enums"]["transaction_type"]
  | null;
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type RecurringInterval =
  Database["public"]["Enums"]["recurring_interval"];

export type NewRecurringTransaction =
  Database["public"]["Tables"]["transactions_recurring"]["Insert"];
export type RecurringTransaction =
  Database["public"]["Tables"]["transactions_recurring"]["Row"];

export type TransactionWithCategory = Transaction & {
  category: Category;
};

export type Division = Database["public"]["Enums"]["division"];

// Onboarding
export type DefaultCategory =
  Database["public"]["Tables"]["default_categories"]["Row"];

export type OnboardingStep =
  Database["public"]["Tables"]["onboarding_steps"]["Row"];
