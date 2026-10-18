"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, parseISO, startOfYesterday } from "date-fns";
import { createInsertSchema } from "drizzle-orm/zod";
import { HeartIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import DeleteTransaction from "@/app/(dashboard)/transactions/edit/[id]/delete-transaction";
import {
	type categories,
	type favoriteSchema,
	type settingSchema,
	type transactionAutoSuggest,
	transactions,
	type webhookSchema,
} from "@/drizzle/schema";
import type { TransactionWithRecurringCategory } from "@/drizzle/schema/transaction-recurring-schema";
import { addFavorite, removeFavorite } from "@/features/favorite/favorite-actions";
import { getTextColor } from "@/features/transactions/colors";
import AmountInput from "@/features/transactions/components/amount-input";
import CategoryNameColor from "@/features/transactions/components/category-name-color";
import { TransactionSelectItems } from "@/features/transactions/components/transaction-select-items";
import {
	makeTransactionRecurring,
	upsertTransaction,
} from "@/features/transactions/transactions-api";
import { AutoComplete, type AutoCompleteRef } from "@/features/ui/auto-suggest-input";
import { Button } from "@/features/ui/button";
import { Calendar } from "@/features/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/features/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/features/ui/form";
import { Input } from "@/features/ui/input";
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

const transactionFormSchema = createInsertSchema(transactions, {
	description: (schema) => schema.min(1),
}).pick({
	description: true,
	type: true,
	costType: true,
	categoryId: true,
	amount: true,
	datetime: true,
	status: true,
	dueNotificationDays: true,
	webhookId: true,
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

const TransactionForm = ({
	transaction,
	autoSuggests,
	allCategories,
	favorites,
	settings,
	webhooks,
}: {
	transaction?: TransactionWithRecurringCategory | undefined;
	autoSuggests?: (typeof transactionAutoSuggest.$inferSelect)[];
	allCategories?: (typeof categories.$inferSelect)[];
	favorites?: (typeof favoriteSchema.$inferSelect & {
		category: typeof categories.$inferSelect;
	})[];
	settings: typeof settingSchema.$inferSelect;
	webhooks: (typeof webhookSchema.$inferSelect)[];
}) => {
	const defaultValues: TransactionFormValues = {
		description: transaction?.description ?? "",
		type: transaction?.type ?? "expense",
		amount: transaction?.amount ?? 0,
		datetime: transaction?.datetime ?? format(new Date(), DB_DATE_FORMAT),
		categoryId: transaction?.category.id ?? "",
		costType: transaction?.costType ?? "variable",
		status: transaction?.status ?? "booked",
		dueNotificationDays: transaction?.dueNotificationDays ?? settings.dueTransactionReminderDays,
		webhookId: transaction?.webhookId ?? webhooks[0]?.id ?? "",
	};

	const form = useForm({
		resolver: zodResolver(transactionFormSchema),
		defaultValues,
		mode: "onChange",
	});

	const autoCompleteRef = useRef<AutoCompleteRef>(null);

	function resetForm() {
		form.reset(defaultValues);
		if (autoCompleteRef?.current) {
			autoCompleteRef.current.clearInput();
		}
	}

	const typeValue = form.watch("type");
	const categoryValue = form.watch("categoryId");
	const costTypeValue = form.watch("costType");

	async function handleSubmit(values: TransactionFormValues) {
		const { error } = await upsertTransaction({
			...values,
			id: transaction?.id,
		});

		if (error) {
			console.error(error);
			toast.error(`Failed to ${transaction ? "save" : "create"} transaction`);
		} else if (!transaction) {
			toast.success("Transaction created successfully!");
			resetForm();
		} else {
			toast.success("Transaction saved successfully");
		}
	}

	const favorite = favorites?.find((favorite) => transaction?.description === favorite.description);
	const isFavorite = transaction && favorite;

	const [favoriteOpen, setFavoriteOpen] = useState<boolean>(false);

	const isPlanned = form.watch("status") === "planned";

	return (
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
					<div className="col-span-2 flex justify-between items-center">
						<div className="flex gap-x-1 items-center">
							<Button
								disabled={!transaction}
								variant="outline"
								type="button"
								onClick={() => {
									if (isFavorite) {
										return removeFavorite(favorite?.id);
									}
									if (transaction) {
										return addFavorite(transaction);
									}
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
						</div>
						{transaction && <DeleteTransaction id={transaction.id} />}

						<Dialog open={favoriteOpen} onOpenChange={setFavoriteOpen}>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Favorites</DialogTitle>
								</DialogHeader>
								{favorites?.map((item) => (
									<div key={item.id} className="flex justify-between">
										<div className="flex flex-col">
											<span className={getTextColor(item.type)}>{item.description}</span>
											<div>
												<span style={{ color: item.category?.color ?? "" }}>
													{item.category?.name}
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
												form.setValue("amount", item.amount);

												if (item.category) {
													form.setValue("categoryId", item.category.id);
												}

												autoCompleteRef.current?.setInputValue(item.description);
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
					<div className=" grid grid-cols-1 md:grid-cols-2 gap-5 bg-card p-4">
						<FormField
							control={form.control}
							name="description"
							render={() => (
								<FormItem className="col-span-2">
									<FormLabel>Description</FormLabel>
									<FormControl>
										<AutoComplete
											ref={autoCompleteRef}
											value={autoSuggests?.find((autoSuggest) => {
												return (
													autoSuggest.type === transaction?.type &&
													autoSuggest.description === transaction?.description &&
													autoSuggest.category === transaction?.category.id
												);
											})}
											placeholder="Enter or choose description"
											onValueChange={(e: typeof transactionAutoSuggest.$inferSelect) => {
												form.setValue("description", e.description ?? "", {
													shouldValidate: true,
												});
												if (e.type) {
													form.setValue("type", e.type);
												}
												if (e.category) {
													form.setValue("categoryId", e.category);
												}
											}}
											options={autoSuggests ?? []}
										/>
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
										<AmountInput value={field.value} onChange={field.onChange} />
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
							name="categoryId"
							render={({ field }) => (
								<FormItem
									className={cn({
										"col-span-2": typeValue !== "expense",
									})}
								>
									<FormLabel>Category</FormLabel>
									<Select onValueChange={field.onChange} value={categoryValue}>
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

						{typeValue === "expense" && (
							<FormField
								control={form.control}
								name="costType"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Cost Type</FormLabel>
										<Select onValueChange={field.onChange} value={costTypeValue}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select cost type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="fixed">Fixed</SelectItem>
												<SelectItem value="variable">Variable</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

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
														"w-full font-normal bg-transparent",
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

						<FormItem className="flex flex-col">
							<FormLabel>&nbsp;</FormLabel>
							<Button
								className="bg-transparent"
								type="button"
								onClick={() =>
									form.setValue("datetime", format(startOfYesterday(), DB_DATE_FORMAT), {
										shouldValidate: true,
									})
								}
								variant="outline"
							>
								Yesterday
							</Button>
						</FormItem>
					</div>

					<div className="bg-card rounded-md p-4">
						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem className="flex justify-between">
									<FormLabel>Planned Transaction</FormLabel>
									<Switch
										checked={field.value === "planned"}
										onCheckedChange={(value) => {
											field.onChange(value ? "planned" : "booked");
										}}
									></Switch>
									<FormMessage />
								</FormItem>
							)}
						/>

						{isPlanned && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="dueNotificationDays"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Due Notification Days</FormLabel>
											<Input
												{...field}
												onChange={(event) => field.onChange(Number(event.target.value))}
												type="number"
												value={field.value ?? ""}
											/>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="webhookId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Notification Webhook</FormLabel>
											<Select {...field} value={field.value ?? ""}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select notification webhook" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{webhooks?.map((webhook) => {
														return (
															<SelectItem key={webhook.id} value={webhook.id}>
																{webhook.name}
															</SelectItem>
														);
													})}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						)}
					</div>

					{transaction && (
						<div className="col-span-2 flex justify-between items-center bg-card p-4 rounded-md">
							<p>Recurring</p>

							<div className="flex gap-x-2">
								<Button
									type="button"
									className="bg-transparent"
									variant="outline"
									disabled={
										transaction.recurringTransaction !== null &&
										transaction.recurringTransaction.interval === "monthly"
									}
									onClick={() => makeTransactionRecurring(transaction, "monthly")}
								>
									Monthly Recurring
								</Button>

								<Button
									type="button"
									variant="outline"
									className="bg-transparent"
									disabled={
										transaction.recurringTransaction !== null &&
										transaction.recurringTransaction.interval === "annually"
									}
									onClick={() => makeTransactionRecurring(transaction, "annually")}
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
						{form.formState.isSubmitting ? <Spinner /> : transaction ? "Save" : "Add Transaction"}
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default TransactionForm;
