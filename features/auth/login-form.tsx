"use client";

import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Mail, Pencil } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useRef, useState, useTransition } from "react";
import { signIn, signUp } from "@/features/auth/auth-actions";
import { SubmitButton } from "@/features/auth/submit-button";
import { Button } from "@/features/ui/button";
import { Input } from "@/features/ui/input";
import { Label } from "@/features/ui/label";

type Step = "email" | "transitioning" | "password";

export function LoginForm() {
	const [step, setStep] = useState<Step>("email");
	const [email, setEmail] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const passwordRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);

	const isPasswordStep = step === "password";
	const forgotPasswordHref = email.trim()
		? `/forget-password?${new URLSearchParams({ email: email.trim() })}`
		: "/forget-password";

	const handleEmailContinue = () => {
		if (!email.trim() || step !== "email") {
			return;
		}

		setStep("transitioning");
		setTimeout(() => setStep("password"), 450);
	};

	const handleChangeEmail = () => {
		setStep("email");
		setShowPassword(false);
		setError(null);
		setTimeout(() => emailRef.current?.focus(), 0);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		if (!isPasswordStep) {
			event.preventDefault();
			handleEmailContinue();
		}
	};

	const handleAuthAction = (action: typeof signIn | typeof signUp, failureMessage: string) => {
		const formData = new FormData();
		formData.set("email", email);

		if (passwordRef.current) {
			formData.set("password", passwordRef.current.value);
		}

		setError(null);
		startTransition(async () => {
			const result = await action(formData);

			if (result && !result.success) {
				setError(failureMessage);
				passwordRef.current?.focus();
			}
		});
	};

	return (
		<div className="animate-in fade-in duration-500 flex w-full flex-1 flex-col justify-center">
			<div className="mb-8 space-y-2">
				<h1 className="text-2xl font-semibold tracking-tight text-foreground">
					{isPasswordStep ? "Welcome back" : "Sign in to your account"}
				</h1>
				<p className="text-sm text-muted-foreground">
					{isPasswordStep ? "Enter your password to continue." : "Enter your email to get started."}
				</p>
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col gap-5 text-foreground">
				<div className="flex flex-col gap-2">
					<Label htmlFor="email" className="text-sm font-medium">
						Email
					</Label>
					<div className="relative">
						<Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							ref={emailRef}
							id="email"
							name="email"
							type="email"
							autoComplete="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							readOnly={isPasswordStep}
							required
							autoFocus
							className="h-11 rounded-lg border bg-card/50 pl-10 pr-10 transition-colors focus-visible:ring-2 focus-visible:ring-ring read-only:text-muted-foreground"
						/>
						{isPasswordStep && (
							<button
								type="button"
								onClick={handleChangeEmail}
								aria-label="Change email"
								className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							>
								<Pencil className="h-3.5 w-3.5" />
							</button>
						)}
					</div>
				</div>

				{!isPasswordStep && (
					<Button
						type="button"
						onClick={handleEmailContinue}
						disabled={step === "transitioning" || !email.trim()}
						className="group h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
					>
						{step === "transitioning" ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<>
								Continue
								<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
							</>
						)}
					</Button>
				)}

				{isPasswordStep && (
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-5">
						<div className="flex flex-col gap-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="password" className="text-sm font-medium">
									Password
								</Label>
								<Link
									href={forgotPasswordHref}
									className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
								>
									Forgot password?
								</Link>
							</div>
							<div className="relative">
								<Input
									ref={passwordRef}
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
									aria-invalid={error !== null}
									onChange={() => setError(null)}
									placeholder="••••••••"
									required
									autoFocus
									className="h-11 rounded-lg border bg-card/50 pr-10 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
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

						{error && (
							<div
								role="alert"
								className="animate-in fade-in slide-in-from-top-1 duration-200 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
							>
								<AlertCircle className="h-4 w-4 shrink-0" />
								{error}
							</div>
						)}

						<div className="flex flex-col gap-3">
							<SubmitButton
								disabled={isPending}
								formAction={() => handleAuthAction(signIn, "Invalid email or password.")}
								className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-70"
							>
								Sign In
								{isPending && <Loader2 className="h-4 w-4 animate-spin" />}
							</SubmitButton>

							<div className="flex items-center gap-3">
								<div className="h-px flex-1 bg-border" />
								<span className="text-xs text-muted-foreground">or</span>
								<div className="h-px flex-1 bg-border" />
							</div>

							<SubmitButton
								disabled={isPending}
								formAction={() =>
									handleAuthAction(signUp, "We couldn't create your account. Please try again.")
								}
								className="flex h-11 w-full items-center justify-center rounded-lg border border-border bg-transparent font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-70"
							>
								Create account
							</SubmitButton>
						</div>
					</div>
				)}
			</form>
		</div>
	);
}
