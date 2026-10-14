"use client";

import { ArrowLeft, ArrowRight, Loader2, Mail, MailCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import { toast } from "sonner";
import { forgotPasswordAction } from "@/features/auth/auth-actions";
import { Button } from "@/features/ui/button";
import { Input } from "@/features/ui/input";
import { Label } from "@/features/ui/label";

async function forgotPasswordWithToast(
	previousState: Parameters<typeof forgotPasswordAction>[0],
	formData: FormData,
) {
	const result = await forgotPasswordAction(previousState, formData);

	if (result?.code && !result.success) {
		toast.error("We couldn't send the recovery email. Please try again.");
	}

	return result;
}

export function ForgotPasswordForm() {
	const prefilledEmail = useSearchParams().get("email") ?? "";
	const [state, formAction, isPending] = useActionState(forgotPasswordWithToast, {
		success: false,
		code: "",
		email: "",
	});
	const [dismissed, setDismissed] = useState(false);

	const showSuccess = state?.success && !dismissed;

	const handleAction = (formData: FormData) => {
		setDismissed(false);
		formAction(formData);
	};

	return (
		<div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center p-6">
			{showSuccess ? (
				<div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center gap-6 text-center">
					<div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
						<MailCheck className="h-6 w-6" />
					</div>
					<div className="space-y-2">
						<h1 className="text-2xl font-semibold tracking-tight text-foreground">
							Check your email
						</h1>
						<p className="text-sm text-muted-foreground">
							If an account exists for{" "}
							<span className="font-medium text-foreground">{state.email}</span>, we've sent a link
							to reset your password.
						</p>
					</div>
					<div className="flex w-full flex-col gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={() => setDismissed(true)}
							className="h-11 w-full rounded-lg"
						>
							Use a different email
						</Button>
						<Link
							href="/login"
							className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to sign in
						</Link>
					</div>
				</div>
			) : (
				<div className="animate-in fade-in duration-500 flex flex-col">
					<div className="mb-8 space-y-2">
						<h1 className="text-2xl font-semibold tracking-tight text-foreground">
							Reset your password
						</h1>
						<p className="text-sm text-muted-foreground">
							Enter the email linked to your account and we'll send you a recovery link.
						</p>
					</div>

					<form action={handleAction} className="flex flex-col gap-5 text-foreground">
						<div className="flex flex-col gap-2">
							<Label htmlFor="email" className="text-sm font-medium">
								Email
							</Label>
							<div className="relative">
								<Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									placeholder="you@example.com"
									defaultValue={state?.email || prefilledEmail}
									required
									autoFocus
									className="h-11 rounded-lg border bg-card/50 pl-10 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
								/>
							</div>
						</div>

						<Button
							type="submit"
							disabled={isPending}
							className="group h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-70"
						>
							{isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<>
									Send recovery link
									<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
								</>
							)}
						</Button>

						<Link
							href="/login"
							className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to sign in
						</Link>
					</form>
				</div>
			)}
		</div>
	);
}
