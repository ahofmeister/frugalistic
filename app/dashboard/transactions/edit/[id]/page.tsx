import { notFound } from "next/navigation";
import { Suspense } from "react";

import { RelatedTransactions } from "@/app/dashboard/transactions/edit/[id]/related-transactions";
import LoadingSpinner from "@/components/loading/loading";
import TransactionForm from "@/components/transactions/components/transaction-form";
import { TransactionWithRecurring } from "@/types";
import { createClient } from "@/utils/supabase/server";

export default async function TransactionEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: transaction } = await supabase
    .from("transactions")
    .select("*, recurring_transaction(interval)")
    .eq("id", params.id)
    .returns<TransactionWithRecurring[]>()
    .single();

  if (!transaction) {
    notFound();
  }

  const { data: autoSuggests } = await supabase
    .from("transaction_auto_suggest2")
    .select("*")
    .order("frequency", { ascending: false })
    .order("description", { ascending: true });

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="">
      <TransactionForm
        transaction={transaction}
        autoSuggests={autoSuggests ?? []}
        categories={categories ?? []}
      />
      <div className="mt-4 mb-2 text-xl">Related Transactions</div>
      <Suspense fallback={<LoadingSpinner />}>
        <RelatedTransactions description={transaction.description} />
      </Suspense>
    </div>
  );
}
