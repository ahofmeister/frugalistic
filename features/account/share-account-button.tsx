"use client";
import { useActionState, useState } from "react";
import { toast } from "sonner";
import { shareAccount } from "@/features/account/account-actions";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/features/ui/alert-dialog";
import { Button } from "@/features/ui/button";
import { Input } from "@/features/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/features/ui/select";
import { type AccountRole, accountRoles } from "@/drizzle/schema";

export default function ShareAccountButton() {
	const [open, setOpen] = useState(false);
	const [, formAction, isPending] = useActionState(async (_: void, formData: FormData) => {
		const selectedRole = formData.get("role") as AccountRole;
		const selectedEmail = formData.get("email") as string;

		const { error } = await shareAccount(selectedEmail, selectedRole);

		if (!error) {
			toast.success("Account invitation successfully");
			void setOpen(false);
		} else {
			toast.error(error);
		}
	}, undefined);

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button size="sm">Share account</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Share account</AlertDialogTitle>
					<AlertDialogDescription>
						Share account, enable read or write access
					</AlertDialogDescription>
				</AlertDialogHeader>
				<form action={formAction}>
					<div className="space-y-4">
						<div className="space-y-2">
							<Input name="email" type="email" placeholder="Email" required />
						</div>
						<Select name="role" required defaultValue="read">
							<SelectTrigger>
								<SelectValue placeholder="Account Role" />
							</SelectTrigger>
							<SelectContent>
								{accountRoles.map((key) => (
									<SelectItem key={key} value={key}>
										{key.charAt(0).toUpperCase() + key.slice(1)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<AlertDialogFooter className="mt-4">
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Sharing..." : "Share account"}
						</Button>
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
