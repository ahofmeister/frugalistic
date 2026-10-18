"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { createInsertSchema } from "drizzle-orm/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import {
	type categories,
	type settingSchema,
	transactionsRecurring,
	type webhookSchema,
} from "@/drizzle/schema";
import AmountInput from "@/features/transactions/components/amount-input";
import CategoryNameColor from "@/features/transactions/components/category-name-color";
import TransactionPlannedFormFields from "@/features/transactions/components/transaction-planned-form-fields";
import { TransactionSelectItems } from "@/features/transactions/components/transaction-select-items";
import { updateRecurringTransaction } from "@/features/transactions/transactions-api";
import { Button } from "@/features/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/features/ui/form";
import { Input } from "@/features/ui/input";
import { Label } from "@/features/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/features/ui/select";
import { Spinner } from "@/features/ui/spinner";
import { Switch } from "@/features/ui/switch";

const formSchema = createInsertSchema(transactionsRecurring);
export type RecurringTransactionFormValues = z.infer<typeof formSchema>;

const RecurringTransactionForm = ({
	transaction,
	allCategories,
	settings,
	webhooks,
}: {
	transaction: typeof transactionsRecurring.$inferSelect;
	allCategories: (typeof categories.$inferSelect)[];
	settings: typeof settingSchema.$inferSelect;
	webhooks: (typeof webhookSchema.$inferSelect)[];
}) => {
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: transaction.description,
			type: transaction.type,
			amount: transaction.amount,
			interval: transaction.interval,
			enabled: transaction.enabled,
			categoryId: transaction.categoryId,
			status: transaction.status,
			dueNotificationDays: settings.dueTransactionReminderDays,
			startDate: transaction.startDate,
			webhookId: transaction.webhookId,
		},
		mode: "onChange",
	});

	async function handleSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		const result = await updateRecurringTransaction({
			...values,
			id: transaction.id,
		});

		if (result?.success) {
			toast.success("Transaction updated successfully");
		} else {
			toast.error("Failed to update transaction");
		}
	}

	const typeValue = form.watch("type");
	const intervalValue = form.watch("interval");
	const isPlanned = form.watch("status") === "planned";

	useEffect(() => {
		form.trigger();
	}, [form]);

	const { errors } = form.formState;
	const errorEntries = Object.entries(errors);

	return (
		<div className="max-w-3xl mx-auto px-2">
			{errorEntries.length > 0 && (
				<div className="text-destructive text-sm" role="alert">
					{errorEntries.map(([name, error]) => (
						<p key={name}>
							{name}: {error?.message?.toString()}
						</p>
					))}
				</div>
			)}
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
										<AmountInput value={field.value as number} onChange={field.onChange} />
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
								<FormItem>
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

						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select category" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{allCategories?.map((category) => (
												<SelectItem key={category.id} value={category.id}>
													<CategoryNameColor name={category.name} color={category.color} />
												</SelectItem>
											))}
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
											transaction.nextRun ? format(new Date(transaction.nextRun), "PPP") : "N/A"
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
											<Switch checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<Label htmlFor="enabled">Enabled</Label>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<TransactionPlannedFormFields
						isPlanned={isPlanned}
						webhooks={webhooks}
						control={form.control}
					/>

					<Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid}>
						{form.formState.isSubmitting ? <Spinner /> : "Save Changes"}
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default RecurringTransactionForm;
