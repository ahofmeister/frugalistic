import { redirect } from "next/navigation";

import TransactionForm from "@/components/transactions/components/transaction-form";
import { createClient } from "@/utils/supabase/server";

export default async function NewTransactionPage() {
  return (
    <div>
      <TransactionForm />
    </div>
  );
}
