import { Suspense } from "react";

import { RelatedTransactions } from "@/app/(dashboard)/transactions/edit/[id]/related-transactions";
import { TransactionFormData } from "@/app/(dashboard)/transactions/new/transactionFormData";

export default async function TransactionEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div>
      <Suspense>
        <TransactionFormData transactionId={props.params.then((p) => p.id)} />
      </Suspense>
      <div className="mt-4 mb-2 text-xl">Related Transactions</div>
      <Suspense>
        <RelatedTransactions id={props.params.then((p) => p.id)} />
      </Suspense>
    </div>
  );
}
