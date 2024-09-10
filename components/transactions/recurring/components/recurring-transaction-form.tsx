"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import LoadingSpinner from "@/components/loading/loading";
import { upsertRecurringTransaction } from "@/components/transactions/transactions-api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecurringTransaction } from "@/types";

const RecurringTransactionForm = ({
  transaction,
}: {
  transaction: RecurringTransaction;
}) => {
  const formSchema = z.object({
    description: z.string(),
    amount: z.coerce.number().min(0),
    type: z.enum(["income", "expense", "savings"]),
    enabled: z.boolean(),
  });

  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: transaction ? transaction.description : "",
      type: transaction ? transaction.type : "expense",
      amount: transaction ? transaction.amount : undefined,
      enabled: transaction.enabled,
    },
  });

  async function handleSubmit(newTransaction: RecurringTransaction) {
    setSubmitting(true);
    await upsertRecurringTransaction({
      ...newTransaction,
    }).then(() => setSubmitting(false));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((newTransaction) =>
          handleSubmit({ ...transaction, ...newTransaction }),
        )}
        className="space-y-6"
      >
        <div className="flex flex-wrap w-2/3 gap-10">
          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Enabled</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input placeholder="amount" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">
            {submitting ? <LoadingSpinner /> : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RecurringTransactionForm;
