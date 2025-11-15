"use client";
import { startTransition, useOptimistic } from "react";
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

  return (
    <>
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
    </>
  );
};

export default RecurringTransactionForm;
