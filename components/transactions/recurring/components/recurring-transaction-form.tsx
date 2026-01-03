"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateRecurringTransaction } from "@/components/transactions/transactions-api";
import LoadingSpinner from "@/components/loading/loading";
import AmountInput from "@/components/transactions/components/amount-input";
import { TransactionSelectItems } from "@/components/transactions/components/transaction-select-items";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
    description: z.string().min(1),
    amount: z.coerce.string(),
    type: z.enum(["income", "expense", "savings"]),
    interval: z.enum(["monthly", "annually"]),
    enabled: z.boolean(),
  });

  const defaultValues = {
    description: transaction.description,
    type: transaction.type,
    amount: transaction.amount.toString(),
    interval: transaction.interval,
    enabled: transaction.enabled,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    const result = await updateRecurringTransaction({
      id: transaction.id,
      ...values,
      amount: Number(values.amount.replace(/\D/g, "")),
    });

    if (result?.success) {
      toast.success("Transaction updated successfully");
    } else {
      toast.error("Failed to update transaction");
    }
  }

  const typeValue = form.watch("type");
  const intervalValue = form.watch("interval");

  return (
    <div className="max-w-2xl mx-auto px-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Controller
              name="amount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <AmountInput
                      value={field.value}
                      onChange={field.onChange}
                    />
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
                    value={typeValue}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <TransactionSelectItems />
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interval"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Interval</FormLabel>
                  <Select
                    value={intervalValue}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-2">
              <FormItem>
                <FormLabel>Next Run</FormLabel>
                <FormControl>
                  <Input
                    value={
                      transaction.next_run
                        ? format(new Date(transaction.next_run), "PPP")
                        : "N/A"
                    }
                    disabled
                  />
                </FormControl>
              </FormItem>
            </div>

            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <Label htmlFor="enabled">Enabled</Label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {form.formState.isSubmitting ? <LoadingSpinner /> : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RecurringTransactionForm;
