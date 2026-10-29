"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, parseISO } from "date-fns";
import { createInsertSchema } from "drizzle-orm/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import FormattedDate from "@/app/(dashboard)/dashboard/formatted-date";
import { useSettings } from "@/app/(dashboard)/settings/settings-provider";
import { type categories, transactionsRecurring, type webhookSchema } from "@/drizzle/schema";
import AmountInput from "@/features/transactions/components/amount-input";
import CategoryNameColor from "@/features/transactions/components/category-name-color";
import TransactionPlannedFormFields from "@/features/transactions/components/transaction-planned-form-fields";
import { TransactionSelectItems } from "@/features/transactions/components/transaction-select-items";
import { upsertRecurringTransaction } from "@/features/transactions/transactions-api";
import { Button } from "@/features/ui/button";
import { Calendar } from "@/features/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/features/ui/form";
import { Input } from "@/features/ui/input";
import { Label } from "@/features/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/features/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/features/ui/select";
import { Spinner } from "@/features/ui/spinner";
import { Switch } from "@/features/ui/switch";
import { cn, DB_DATE_FORMAT } from "@/lib/utils";

const formSchema = createInsertSchema(transactionsRecurring);
export type RecurringTransactionFormValues = z.infer<typeof formSchema>;

const RecurringTransactionForm = ({
	transaction,
	allCategories,
	webhooks,
}: {
	transaction?: typeof transactionsRecurring.$inferSelect;
	allCategories: (typeof categories.$inferSelect)[];
	webhooks: (typeof webhookSchema.$inferSelect)[];
}) => {
	const settings = useSettings();

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: transaction?.description ?? "",
			type: transaction?.type ?? "expense",
			amount: transaction?.amount ?? 0,
			interval: transaction?.interval ?? "monthly",
			enabled: transaction?.enabled ?? true,
			categoryId: transaction?.categoryId ?? "",
			status: transaction?.status ?? "booked",
			dueNotificationDays: settings.dueTransactionReminderDays,
			startDate: transaction?.startDate ?? format(new Date(), DB_DATE_FORMAT),
			webhookId: transaction?.webhookId ?? webhooks[0]?.id ?? null,
			nextRun: transaction?.nextRun ?? "",
		},
		mode: "onChange",
	});

	async function handleSubmit(values: z.infer<typeof formSchema>) {
		const result = await upsertRecurringTransaction({
			...values,
			id: transaction?.id,
		});

		if (result?.success) {
			toast.success(`Transaction ${values.id ? "saved" : "created"}`);
		} else {
			toast.error(`Failed to ${values.id ? "save" : "create"} transaction`);
		}
	}

	const typeValue = form.watch("type");
	const intervalValue = form.watch("interval");
	const isPlanned = form.watch("status") === "planned";
	const startDate = form.watch("startDate");

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

						<FormField
							control={form.control}
							name="startDate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													className={cn(
														"w-full font-normal bg-transparent h-9",
														!field.value && "foreground",
													)}
												>
													{field.value ? (
														format(parseISO(field.value), "PPP")
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
												selected={parseISO(field.value)}
												onSelect={(date) => {
													if (date) {
														field.onChange(format(date, DB_DATE_FORMAT));
													}
												}}
												disabled={(date) => date < new Date("2000-01-01")}
												required
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<p className="flex flex-col">
							<FormLabel>Next Run</FormLabel>
							<span className="inline-flex h-9 items-center rounded-md border border-input bg-transparent px-3 text-foreground">
								<FormattedDate date={transaction?.nextRun ? transaction.nextRun : startDate} />
							</span>
						</p>

						<FormField
							control={form.control}
							name="enabled"
							render={({ field }) => (
								<FormItem className="col-span-2">
									<div className="flex items-center justify-between">
										<Label htmlFor="enabled">Enabled</Label>
										<FormControl>
											<Switch checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
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
