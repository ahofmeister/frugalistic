import TransactionForm from "@/components/transactions/components/transaction-form";
import { Category, FavoriteWithCategory } from "@/types";
import { createClient } from "@/utils/supabase/server";

export default async function NewTransactionPage() {
  const supabase = await createClient();

  const { data: autoSuggests } = await supabase
    .from("transaction_auto_suggest")
    .select("*")
    .order("frequency", { ascending: false })
    .order("description", { ascending: true });

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")
    .returns<Category[]>();

  const { data: favorites } = await supabase
    .from("favorite")
    .select("*, category(*)")
    .order("description")
    .returns<FavoriteWithCategory[]>();
  return (
    <TransactionForm
      favorites={favorites ?? []}
      autoSuggests={autoSuggests ?? []}
      categories={categories ?? []}
    />
  );
}
