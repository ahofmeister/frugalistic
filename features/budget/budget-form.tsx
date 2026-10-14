"use client";

import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { createInsertSchema } from "drizzle-orm/zod";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	budgetPeriods,
	budgetSchema,
	type categories,
	recurringIntervals,
	transactionTypes,
} from "@/drizzle/schema";
import { createBudget } from "@/features/budget/budget-actions";
import DeleteBudget from "@/features/budget/delete-budget";
import CategoryNameColor from "@/features/transactions/components/category-name-color";
import { TransactionSelectItems } from "@/features/transactions/components/transaction-select-items";
import { Button } from "@/features/ui/button";
import { Calendar } from "@/features/ui/calendar";
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
import { capitalize, cn } from "@/lib/utils";

const scheduleDescription = (
	type: (typeof budgetPeriods)[number],
	startDate: Date | undefined,
	targetDate: Date | undefined,
	interval: (typeof recurringIntervals)[number] | null | undefined,
) => {
	if (type === "manual") {
		const start = startDate ? format(startDate, "PPP") : "your start date";
		const end = targetDate ? format(targetDate, "PPP") : "your end date";
		return `Runs from ${start} to ${end} and does not repeat.`;
	}

	const intro = startDate
		? `Starts in ${format(startDate, "MMMM yyyy")} and covers one ${type}.`
		: `Starts on your start date and covers one ${type}.`;

	if (interval === "monthly") {
		return `${intro} It repeats every month.`;
	}

	if (interval === "annually") {
		const month = startDate ? ` in ${format(startDate, "MMMM")}` : "";
		return `${intro} It repeats every year${month}.`;
	}

	return `${intro} It does not repeat.`;
};

const budgetFormSchema = createInsertSchema(budgetSchema, {
	name: z.string().min(3),
	period: z.enum(budgetPeriods),
	flow: z.enum(transactionTypes),
	repeating: z.enum(recurringIntervals).nullable().optional(),
	startDate: z.date(),
	targetDate: z.date().optional(),
})
	.omit({
		id: true,
		userId: true,
		accountId: true,
		createdAt: true,
		updatedAt: true,
	})
	.superRefine((data, ctx) => {
		if (data.period === "manual" && !data.targetDate) {
			ctx.addIssue({
				code: "custom",
				message: "Target date is required for manual budgets",
				path: ["targetDate"],
			});
		}
		if (data.period === "year" && data.repeating === "monthly") {
			ctx.addIssue({
				code: "custom",
				message: "A yearly budget can only repeat every year",
				path: ["interval"],
			});
		}
	});

const BudgetForm = ({
	budget,
	fetchedCategories,
}: {
	budget?: typeof budgetSchema.$inferSelect;
	fetchedCategories: (typeof categories.$inferSelect)[];
}) => {
	const form = useForm({
		resolver: zodResolver(budgetFormSchema),
		defaultValues: {
			name: budget?.name ?? undefined,
			categoryId: budget?.categoryId ?? undefined,
			period: budget?.period ?? "month",
			amount: budget?.amount ?? undefined,
			flow: budget?.flow ?? "expense",
			repeating: budget?.repeating ?? undefined,
			startDate: budget?.startDate ? new Date(budget.startDate) : undefined,
			targetDate: budget?.targetDate ? new Date(budget.targetDate) : undefined,
		},
		mode: "onChange",
	});

	async function handleSubmit(newBudget: typeof budgetSchema.$inferInsert) {
		await createBudget({
			...newBudget,
			id: budget ? budget.id : undefined,
		});
		redirect("/budgets");
	}

	const currentPeriod = form.watch("period");
	const currentStartDate = form.watch("startDate");
	const currentTargetDate = form.watch("targetDate");
	const currentRepeating = form.watch("repeating");

	return (
		<div className="max-w-2xl mx-auto px-2 py-4">
			<Form {...form}>
				<DevTool control={form.control} placement={"top-right"} />
				<form
					onSubmit={form.handleSubmit((newBudget) => {
						return handleSubmit({
							...newBudget,
							startDate: format(newBudget.startDate, "yyyy-MM-dd"),
							targetDate: newBudget.targetDate
								? format(newBudget.targetDate, "yyyy-MM-dd")
								: undefined,
						});
					})}
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel required>Name</FormLabel>
									<FormControl>
										<Input placeholder="Name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel required>Category</FormLabel>
									<FormControl>
										<Select
											value={field.value}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{fetchedCategories.map((category) => (
													<SelectItem key={category.id} value={category.id}>
														<CategoryNameColor name={category.name} color={category.color} />
													</SelectItem>
												))}
											</SelectContent>
										</Select>
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
									<FormLabel required>Amount</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Amount"
											{...field}
											value={field.value ?? ""}
											onChange={(event) =>
												field.onChange(
													event.target.value === "" ? undefined : event.target.valueAsNumber,
												)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="flow"
							defaultValue="expense"
							render={({ field }) => (
								<FormItem>
									<FormLabel required>Flow</FormLabel>
									<Select
										value={field.value}
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
							name="period"
							render={({ field }) => (
								<FormItem>
									<FormLabel required>Period</FormLabel>
									<FormControl>
										<Select
											value={field.value}
											onValueChange={(value) => {
												field.onChange(value);
												if (value === "year" && form.getValues("repeating") === "monthly") {
													form.setValue("repeating", "annually", { shouldValidate: true });
												}
											}}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{budgetPeriods.map((type) => (
													<SelectItem key={type} value={type}>
														<div className="flex items-center gap-2">
															<span>{capitalize(type)}</span>
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="repeating"
							disabled={currentPeriod === "manual"}
							defaultValue="monthly"
							render={({ field }) => (
								<FormItem>
									<FormLabel required={currentPeriod !== "manual"}>Repeating</FormLabel>
									<Select
										value={field.value ?? "none"}
										onValueChange={(value) => field.onChange(value === "none" ? null : value)}
										defaultValue={field.value ?? "none"}
										disabled={currentPeriod === "manual"}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="none">No Repeating</SelectItem>
											{recurringIntervals
												.filter((type) => !(currentPeriod === "year" && type === "monthly"))
												.map((type) => (
													<SelectItem key={type} value={type}>
														<div className="flex items-center gap-2">
															<span>{capitalize(type)}</span>
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
							name="startDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel required>Start Date</FormLabel>
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
													{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
												required
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="targetDate"
							disabled={currentPeriod !== "manual"}
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel required={currentPeriod === "manual"}>End Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													className={cn(
														"w-full pl-3 text-left font-normal",
														!field.value && "text-muted-foreground",
													)}
													disabled={currentPeriod !== "manual"}
												>
													{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
												disabled={(date) =>
													date < new Date("1900-01-01") || currentPeriod !== "manual"
												}
												required
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<p className="text-sm text-muted-foreground md:col-span-2">
							{scheduleDescription(
								currentPeriod,
								currentStartDate,
								currentTargetDate,
								currentRepeating,
							)}
						</p>

						<div className="flex flex-col gap-y-4 col-span-2">
							{budget && <DeleteBudget id={budget.id} />}

							<Button
								type="submit"
								disabled={form.formState.isSubmitting || !form.formState.isValid}
								className="w-full"
							>
								{form.formState.isSubmitting ? <Spinner /> : budget ? "Save" : "Create Budget"}
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default BudgetForm;
