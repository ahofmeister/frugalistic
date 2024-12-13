"use client";
import { startTransition, useOptimistic } from "react";

import DeleteRecurringTransaction from "@/app/dashboard/recurring/delete-recurring-transaction";
import { formatAmount } from "@/components/transactions/components/transaction-amount";
import { toggleEnabledRecurringTransaction } from "@/components/transactions/transactions-api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { capitalize } from "@/lib/utils";
import { RecurringTransaction } from "@/types";

const RecurringTransactionForm = ({
  transaction,
}: {
  transaction: RecurringTransaction;
}) => {
  async function formAction(state: boolean) {
    startTransition(() => {
      addOptimistic(!state);
    });

    await toggleEnabledRecurringTransaction(transaction.id, state);
  }

  const [optimisticEnabled, addOptimistic] = useOptimistic(
    transaction.enabled,
    (state: boolean) => !state,
  );

  // TODO Move enabled Switch to own component
  return (
    <div className="space-y-6 mx-auto max-w-lg">
      <div className="flex flex-col gap-y-4">
        <Input value={transaction.description} disabled className="w-full" />

        <Input disabled={true} value={formatAmount(transaction.amount)} />

        <Input value={capitalize(transaction.type)} disabled={true} />

        <div className="flex items-center space-x-2">
          <Switch
            id="enabled"
            checked={optimisticEnabled}
            onCheckedChange={(value) => formAction(value)}
            className="mr-2"
          />
          <Label htmlFor="enabled">Enabled</Label>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <div className="w-full">
            <DeleteRecurringTransaction recurringTransaction={transaction} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecurringTransactionForm;
