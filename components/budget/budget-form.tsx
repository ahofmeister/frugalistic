"use client";

import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createBudget } from "@/components/budget/budget-actions";
import DeleteBudget from "@/components/budget/delete-budget";
import { TransactionSelectItems } from "@/components/transactions/components/transaction-select-items";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
	type budgetSchema,
	budgetTypes,
	type categories,
	recurringIntervals,
	transactionTypes,
} from "@/drizzle/schema";
import { capitalize, cn } from "@/lib/utils";

const BudgetForm = ({
	budget,
	fetchedCategories,
}: {
	budget?: typeof budgetSchema.$inferSelect;
	fetchedCategories: (typeof categories.$inferSelect)[];
}) => {
	const formSchema = z
		.object({
			name: z.string().min(3),
			categoryId: z.string(),
			type: z.enum(budgetTypes),
			amount: z.coerce.number(),
			flow: z.enum(transactionTypes),
			interval: z.enum(recurringIntervals),
			startDate: z.date(),
			targetDate: z.date().optional(),
		})
		.superRefine((data, ctx) => {
			if (data.type === "manual" && !data.targetDate) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Target date is required for manual budgets",
					path: ["targetDate"],
				});
			}
		});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: budget?.name ?? undefined,
			categoryId: budget?.categoryId ?? undefined,
			type: budget?.type ?? "recurring",
			amount: budget?.amount ?? undefined,
			flow: budget?.flow ?? "expense",
			interval: budget?.interval ?? "monthly",
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

	const currentType = form.watch("type");

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
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="type"
							defaultValue="recurring"
							render={({ field }) => (
								<FormItem>
									<FormLabel required>Type</FormLabel>
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
												{budgetTypes.map((type) => (
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
							name="interval"
							disabled={currentType === "manual"}
							defaultValue="monthly"
							render={({ field }) => (
								<FormItem>
									<FormLabel required={currentType !== "manual"}>Interval</FormLabel>
									<Select
										value={field.value}
										onValueChange={field.onChange}
										defaultValue={field.value}
										disabled={currentType === "manual"}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{recurringIntervals.map((type) => (
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
							name="amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel required>Amount</FormLabel>
									<FormControl>
										<Input type="number" placeholder="Amount" {...field} />
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
							disabled={currentType !== "manual"}
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel required={currentType !== "recurring"}>End Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													className={cn(
														"w-full pl-3 text-left font-normal",
														!field.value && "text-muted-foreground",
													)}
													disabled={currentType !== "manual"}
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
													date < new Date("1900-01-01") || currentType !== "manual"
												}
												required
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
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
