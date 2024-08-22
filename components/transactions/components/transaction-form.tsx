"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { upsertTransaction } from "@/components/transactions/transactions-api";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Category, NewTransaction, Transaction } from "@/types";
import { createClient } from "@/utils/supabase/client";

const TransactionForm = ({ transaction }: { transaction?: Transaction }) => {
  const formSchema = z.object({
    description: z.string(),
    amount: z.coerce.number().min(0),
    type: z.enum(["income", "expense", "savings"]),
    category: z.string(),
    datetime: z.date(),
  });

  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: transaction ? transaction.description : "",
      type: transaction ? transaction.type : "expense",
      amount: transaction ? transaction.amount : undefined,
      datetime: transaction ? new Date(transaction.datetime) : new Date(),
      category:
        transaction && transaction.category ? transaction.category : undefined,
    },
  });

  async function handleSubmit(newTransaction: NewTransaction) {
    setSubmitting(true);
    await upsertTransaction({
      ...newTransaction,
      id: transaction ? transaction.id : undefined,
    }).then(() => setSubmitting(false));
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((transaction) =>
          handleSubmit({
            ...transaction,
            datetime: format(transaction.datetime, "yyyy-MM-dd"),
          }),
        )}
        className="space-y-6"
      >
        <div className="flex flex-wrap w-2/3 gap-10">
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

          <div className="w-fit">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
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
                      {categories?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          <div className="flex gap-x-5 items-center">
                            <div
                              className="w-3 h-3"
                              style={{ background: category.color ?? "" }}
                            />
                            {category.name}
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
              <FormItem>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Input
                        placeholder="Pick a date"
                        value={
                          field.value ? format(field.value, "PPP") : undefined
                        }
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      ></Input>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">{submitting ? "Saving" : "Add"}</Button>
        </div>
      </form>
    </Form>
  );
};

export default TransactionForm;
