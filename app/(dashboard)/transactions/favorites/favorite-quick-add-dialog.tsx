"use client";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useActionState, useState } from "react";
import { toast } from "sonner";
import { formatAmount } from "@/components/transactions/components/transaction-amount";
import { insertTransaction } from "@/components/transactions/transactions-api";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { favoriteSchema } from "@/db/migrations/schema";
import { cn } from "@/lib/utils";

type QuickAddState = {
	success: boolean;
	error: string | null;
};

export function FavoriteQuickAddDialog({
	favorite,
}: {
	favorite: typeof favoriteSchema.$inferSelect;
}) {
	const [open, setOpen] = useQueryState(
		`quickAdd-${favorite.id}`,
		parseAsBoolean.withDefault(false),
	);
	const [date, setDate] = useState(new Date());

	const [, formAction, isPending] = useActionState(
		async (_: QuickAddState, formData: FormData): Promise<QuickAddState> => {
			const selectedDate = formData.get("date") as string;

			try {
				await insertTransaction({
					description: favorite.description,
					amount: favorite.amount,
					category: favorite.category,
					type: favorite.type,
					datetime: new Date(selectedDate).toDateString(),
				});
				toast.success("Transaction added from favorite");
				void setOpen(false);
				return { success: true, error: null };
			} catch (_e) {
				toast.error("Failed to add transaction from favorite");
				return { success: false, error: "Failed to add transaction" };
			}
		},
		{ success: false, error: null },
	);

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
					<Plus className="h-4 w-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Quick Add Transaction</AlertDialogTitle>
					<AlertDialogDescription>
						{favorite.description} • {formatAmount(favorite.amount)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<form action={formAction}>
					<input type="hidden" name="date" value={date.toISOString()} />
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="date">Date</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										type="button"
										variant="outline"
										className={cn(
											"w-full pl-3 text-left font-normal",
											!date && "text-muted-foreground",
										)}
									>
										{date ? format(date, "PPP") : <span>Pick a date</span>}
										<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										weekStartsOn={1}
										mode="single"
										selected={date}
										onSelect={(date) => date && setDate(date)}
										disabled={(date) => date < new Date("1900-01-01")}
										required
									/>
								</PopoverContent>
							</Popover>
						</div>
					</div>
					<AlertDialogFooter className="mt-4">
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Adding..." : "Add Transaction"}
						</Button>
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
