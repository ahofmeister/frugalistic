"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { format } from "date-fns";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import AmountInput from "@/components/transactions/components/amount-input";
import { upsertTransaction } from "@/components/transactions/transactions-api";
import { AutoComplete } from "@/components/ui/auto-suggest-input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  NewTransaction,
  Transaction,
  TransactionAutoSuggest,
} from "@/types";
import { createClient } from "@/utils/supabase/client";

const TransactionForm = ({
  transaction,
  autoSuggests,
}: {
  transaction?: Transaction;
  autoSuggests?: TransactionAutoSuggest[];
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

  useEffect(() => {
    if (form.formState.isSubmitSuccessful || transaction) {
      form.reset(defaultValues);
    }
  }, [form.formState.isSubmitSuccessful, transaction, form.reset]);

  const typeValue = form.watch("type");
  const categoryValue = form.watch("category");

  async function handleSubmit(newTransaction: NewTransaction) {
    await upsertTransaction({
      ...newTransaction,
      id: transaction ? transaction.id : undefined,
    });
  }

  const { data: categories } = useQuery(
    createClient()
      .from("categories")
      .select("*")
      .order("name")
      .returns<Category[]>(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-md">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <AutoComplete
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
                        <SelectValue placeholder="Select type" />
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
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
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
          </div>
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
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            // disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {form.formState.isSubmitting
              ? "Saving..."
              : transaction
                ? "Save"
                : "Add Transaction"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TransactionForm;
