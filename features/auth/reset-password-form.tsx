"use client";

import { ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { toast } from "sonner";
import { resetPasswordAction } from "@/features/auth/auth-actions";
import { Button } from "@/features/ui/button";
import { Input } from "@/features/ui/input";
import { Label } from "@/features/ui/label";

const REDIRECT_DELAY_MS = 3000;

export function ResetPasswordForm() {
	const router = useRouter();

	const resetPasswordWithFeedback = async (
		previousState: Parameters<typeof resetPasswordAction>[0],
		formData: FormData,
	) => {
		const result = await resetPasswordAction(previousState, formData);

		if (result?.success) {
			setTimeout(() => router.push("/login"), REDIRECT_DELAY_MS);
		} else if (result?.code) {
			toast.error("We couldn't reset your password. Please try again.");
		}

		return result;
	};

	const [state, action, isPending] = useActionState(resetPasswordWithFeedback, {
		success: false,
		code: "",
	});
	const [showPassword, setShowPassword] = useState(false);

	const passwordType = showPassword ? "text" : "password";

	return (
		<div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center p-6">
			{state?.success ? (
				<div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center gap-6 text-center">
					<div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
						<CheckCircle2 className="h-6 w-6" />
					</div>
					<div className="space-y-2">
						<h1 className="text-2xl font-semibold tracking-tight text-foreground">
							Password updated
						</h1>
						<p className="text-sm text-muted-foreground">
							You can now sign in with your new password. We're taking you to the sign in page.
						</p>
					</div>
					<Link
						href="/login"
						className="group inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
					>
						Go to sign in
						<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
					</Link>
				</div>
			) : (
				<div className="animate-in fade-in duration-500 flex flex-col">
					<div className="mb-8 space-y-2">
						<h1 className="text-2xl font-semibold tracking-tight text-foreground">
							Set a new password
						</h1>
						<p className="text-sm text-muted-foreground">
							Choose a strong password you haven't used before.
						</p>
					</div>

					<form action={action} className="flex flex-col gap-5 text-foreground">
						<div className="flex flex-col gap-2">
							<Label htmlFor="newPassword" className="text-sm font-medium">
								New password
							</Label>
							<div className="relative">
								<Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="newPassword"
									name="newPassword"
									type={passwordType}
									autoComplete="new-password"
									placeholder="••••••••"
									required
									autoFocus
									className="h-11 rounded-lg border bg-card/50 pl-10 pr-10 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
								/>
								<button
									type="button"
									onClick={() => setShowPassword((prev) => !prev)}
									aria-label={showPassword ? "Hide password" : "Show password"}
									className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
								>
									{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</button>
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor="passwordConfirmation" className="text-sm font-medium">
								Confirm password
							</Label>
							<div className="relative">
								<Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="passwordConfirmation"
									name="passwordConfirmation"
									type={passwordType}
									autoComplete="new-password"
									placeholder="••••••••"
									required
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
									Update password
									<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
								</>
							)}
						</Button>
					</form>
				</div>
			)}
		</div>
	);
}
