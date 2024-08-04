import { redirect } from "next/navigation";

import TransactionForm from "@/components/transactions/components/transaction-form";
import { createClient } from "@/utils/supabase/server";

export default async function NewTransactionPage() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div>
      <TransactionForm />
    </div>
  );
}
