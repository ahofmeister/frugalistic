"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, startOfYesterday } from "date-fns";
import { HeartIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import DeleteTransaction from "@/app/(dashboard)/transactions/edit/[id]/delete-transaction";
import {
  addFavorite,
  removeFavorite,
} from "@/components/favorite/favorite-actions";
import LoadingSpinner from "@/components/loading/loading";
import AmountInput from "@/components/transactions/components/amount-input";
import { getTextColor } from "@/components/transactions/components/transaction-amount";
import { TransactionSelectItems } from "@/components/transactions/components/transaction-select-items";
import {
  makeTransactionRecurring,
  upsertTransaction,
} from "@/components/transactions/transactions-api";
import {
  AutoComplete,
  AutoCompleteRef,
} from "@/components/ui/auto-suggest-input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Category,
  FavoriteWithCategory,
  NewTransaction,
  TransactionAutoSuggest,
  TransactionWithRecurring,
} from "@/types";

const TransactionForm = ({
  transaction,
  autoSuggests,
  categories,
  favorites,
}: {
  transaction?: TransactionWithRecurring;
  autoSuggests?: TransactionAutoSuggest[];
  categories?: Category[];
  favorites?: FavoriteWithCategory[];
}) => {
  const formSchema = z.object({
    description: z.string().min(1),
    amount: z.coerce.string(),
    type: z.enum(["income", "expense", "savings"]),
    category: z.string(),
    datetime: z.date(),
  });

  const defaultValues = {
    description: transaction ? transaction.description : "",
    type: transaction ? transaction.type : "expense",
    amount: transaction ? transaction.amount.toString() : "0",
    datetime: transaction ? new Date(transaction.datetime) : new Date(),
    category:
      transaction && transaction.category ? transaction.category : undefined,
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  const autoCompleteRef = useRef<AutoCompleteRef>(null);

  function resetForm() {
    form.reset(defaultValues);
    if (autoCompleteRef && autoCompleteRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      autoCompleteRef.current.clearInput();
    }
  }

  const typeValue = form.watch("type");
  const categoryValue = form.watch("category");

  async function handleSubmit(newTransaction: NewTransaction) {
    const { error } = await upsertTransaction({
      ...newTransaction,
      id: transaction ? transaction.id : undefined,
    });

    if (error) {
      toast.error(`Failed to ${transaction ? "save" : "create"} transaction`);
    } else if (!transaction) {
      toast.success("Transaction created successfully!");
      resetForm();
    } else {
      toast.success(`Transaction saved successfully`);
    }
  }

  const favorite = favorites?.find(
    (favorite) => transaction?.description === favorite.description,
  );
  const isFavorite = transaction && favorite;

  const [favoriteOpen, setFavoriteOpen] = useState<boolean>(false);
  return (
    <div className="max-w-2xl mx-auto px-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((transaction) =>
            handleSubmit({
              ...transaction,
              amount: Number(transaction.amount.replace(/\D/g, "")),
              datetime: format(transaction.datetime, "yyyy-MM-dd"),
            }),
          )}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="col-span-2 flex justify-between">
              <Button
                disabled={!transaction}
                variant="outline"
                type="button"
                className="w-fit"
                onClick={() => {
                  if (isFavorite) {
                    return removeFavorite(favorite?.id);
                  }
                  return addFavorite(transaction!);
                }}
              >
                <HeartIcon
                  color={isFavorite ? "#FF00FF" : "#FFFFFF"}
                  fill={isFavorite ? "#FF00FF" : "#FFFFFF"}
                />
              </Button>
              <Button
                disabled={!favorites || favorites.length <= 0}
                variant="outline"
                type="button"
                onClick={() => setFavoriteOpen(true)}
              >
                Favorites
              </Button>
              <Dialog open={favoriteOpen} onOpenChange={setFavoriteOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Favorites</DialogTitle>
                  </DialogHeader>
                  {favorites?.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex flex-col">
                        <span className={getTextColor(item.type)}>
                          {item.description}
                        </span>
                        <div>
                          <span style={{ color: item.category.color ?? "" }}>
                            {item.category.name}
                          </span>{" "}
                          in <span>{item.type}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        type="button"
                        className="flex  self-center"
                        onClick={() => {
                          form.setValue("description", item.description);
                          form.setValue("type", item.type);
                          form.setValue("amount", item.amount.toString());
                          if (item.category) {
                            form.setValue("category", item.category.id);
                          }

                          autoCompleteRef.current?.setInputValue(
                            item.description,
                          );
                          setFavoriteOpen(false);
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  ))}
                </DialogContent>
              </Dialog>
            </div>
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <AutoComplete
                        ref={autoCompleteRef}
                        value={autoSuggests?.find(
                          (l) =>
                            l.type === transaction?.type &&
                            l.description === transaction?.description &&
                            l.category === transaction.category,
                        )}
                        placeholder="Enter or choose description"
                        onValueChange={(e: TransactionAutoSuggest) => {
                          field.onChange(e.description);
                          if (e.type) {
                            form.setValue("type", e.type);
                          }
                          if (e.category) {
                            form.setValue("category", e.category);
                          }
                        }}
                        options={autoSuggests ?? []}
                      />
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
              defaultValue="expense"
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
              name="category"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={categoryValue}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="datetime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        weekStartsOn={1}
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                        required
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem className="flex flex-col">
              <FormLabel>&nbsp;</FormLabel>
              <Button
                type="button"
                onClick={() => form.setValue("datetime", startOfYesterday())}
                variant="outline"
              >
                Yesterday
              </Button>
            </FormItem>
          </div>

          {transaction && (
            <div className="flex flex-col gap-y-2 mt-2">
              <div className="flex gap-x-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={
                    transaction.recurring_transaction &&
                    transaction.recurring_transaction.interval === "monthly"
                  }
                  onClick={() =>
                    makeTransactionRecurring(transaction, "monthly")
                  }
                >
                  Monthly Recurring
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  disabled={
                    transaction.recurring_transaction &&
                    transaction.recurring_transaction.interval === "annually"
                  }
                  onClick={() =>
                    makeTransactionRecurring(transaction, "annually")
                  }
                >
                  Annually Recurring
                </Button>
              </div>
            </div>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {form.formState.isSubmitting ? (
              <LoadingSpinner />
            ) : transaction ? (
              "Save"
            ) : (
              "Add Transaction"
            )}
          </Button>

          {transaction && <DeleteTransaction id={transaction.id} />}
        </form>
      </Form>
    </div>
  );
};

export default TransactionForm;
