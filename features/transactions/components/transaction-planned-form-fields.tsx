"use client";
import type { Control } from "react-hook-form";
import type { TransactionFormValues, webhookSchema } from "@/drizzle/schema";
import type { RecurringTransactionFormValues } from "@/features/transactions/recurring/components/recurring-transaction-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/features/ui/form";
import { Input } from "@/features/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/features/ui/select";
import { Switch } from "@/features/ui/switch";

function TransactionPlannedFormFields<
	T extends TransactionFormValues | RecurringTransactionFormValues,
>(props: {
	webhooks: (typeof webhookSchema.$inferSelect)[];
	isPlanned: boolean;
	control: Control<T>;
}) {
	const { webhooks, isPlanned } = props;
	const control = props.control as unknown as Control<TransactionFormValues>;

	return (
		<div className="bg-card rounded-md p-4">
			<FormField
				control={control}
				name="status"
				render={({ field }) => (
					<FormItem className="flex justify-between">
						<FormLabel>Planned Transaction</FormLabel>
						<Switch
							checked={field.value === "planned"}
							onCheckedChange={(value) => {
								field.onChange(value ? "planned" : "booked");
							}}
						/>
						<FormMessage />
					</FormItem>
				)}
			/>

			{isPlanned && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={control}
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
						control={control}
						name="webhookId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Notification Webhook</FormLabel>
								<Select {...field} onValueChange={field.onChange} value={field.value ?? ""}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select notification webhook" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{webhooks.map((webhook) => (
											<SelectItem key={webhook.id} value={webhook.id}>
												{webhook.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			)}
		</div>
	);
}

export default TransactionPlannedFormFields;
