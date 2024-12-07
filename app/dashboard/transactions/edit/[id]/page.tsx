import TransactionForm from "@/components/transactions/components/transaction-form";
import { Category, TransactionWithRecurring } from "@/types";
import { createClient } from "@/utils/supabase/server";

export default async function TransactionEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const transactionClient = await createClient("transactions");
  const { data: transaction } = await transactionClient
    .from("transactions")
    .select("*, recurring_transaction(interval)")
    .eq("id", params.id)
    .returns<TransactionWithRecurring>()
    .single();

  const autoSuggestClient = await createClient();
  const { data: autoSuggests } = await autoSuggestClient
    .from("transaction_auto_suggest2")
    .select("*")
    .order("frequency", { ascending: false })
    .order("description", { ascending: true });

  const categoriesClient = await createClient("category");
  const { data: categories } = await categoriesClient
    .from("categories")
    .select("*")
    .order("name")
    .returns<Category[]>();

  return (
    <TransactionForm
      transaction={transaction ?? undefined}
      autoSuggests={autoSuggests ?? []}
      categories={categories ?? []}
    />
  );
}
