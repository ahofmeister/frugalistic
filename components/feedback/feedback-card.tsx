"use client";

import { parseAsBoolean, useQueryState } from "nuqs";
import { useActionState } from "react";
import { toast } from "sonner";

import { addFeedback } from "@/components/feedback/feedback-actions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

type FeedbackState = {
	success: boolean;
	error: string | null;
};

export default function FeedbackCard() {
	const [open, setOpen] = useQueryState("feedback", parseAsBoolean.withDefault(false));

	const [, formAction, isPending] = useActionState(
		async (_: FeedbackState, formData: FormData): Promise<FeedbackState> => {
			const feedback = formData.get("feedback") as string;

			try {
				const response = await addFeedback(feedback);
				if (response) {
					void setOpen(false);
					toast.success("Feedback successfully sent!");
					return { success: true, error: null };
				}

				toast.error("Failed to send feedback. Please try again.");
				return { success: false, error: "Failed to send feedback" };
			} catch (error) {
				toast.error("Failed to send feedback. Please try again.");
				console.error(error);
				return { success: false, error: "Failed to send feedback" };
			}
		},
		{ success: false, error: null },
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<div className="w-full cursor-pointer">Give Feedback</div>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader className="flex-row justify-between items-start">
					<DialogTitle className="text-xl">We appreciate your feedback!</DialogTitle>
				</DialogHeader>
				<form action={formAction}>
					<Textarea
						className="min-h-[100px] resize-none"
						placeholder="Write your feedback here..."
						name="feedback"
						required
					/>

					<div className="flex justify-end gap-3 mt-4">
						<Button type="submit" disabled={isPending}>
							{isPending ? <Spinner /> : "Send"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
