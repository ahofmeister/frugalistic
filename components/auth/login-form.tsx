"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { signIn, signUp } from "@/components/auth/auth-actions";
import { SubmitButton } from "@/components/auth/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Step = "email" | "transitioning" | "password";

export function LoginForm() {
	const [step, setStep] = useState<Step>("email");
	const [email, setEmail] = useState("");
	const [isPending, startTransition] = useTransition();
	const passwordRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (step === "password") {
			setTimeout(() => passwordRef.current?.focus(), 50);
		}
	}, [step]);

	const handleEmailContinue = () => {
		if (!email.trim()) return;
		setStep("transitioning");
		setTimeout(() => setStep("password"), 700);
	};

	const handleAuthAction = (action: typeof signIn | typeof signUp) => {
		const formData = new FormData();
		formData.set("email", email);

		if (passwordRef.current) {
			formData.set("password", passwordRef.current.value);
		}
		startTransition(() => action(formData));
	};

	return (
		<form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
			<Label className="text-md" htmlFor="email">
				Email
			</Label>
			<Input
				id="email"
				type="email"
				placeholder="you@example.com"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
				autoFocus
				className="rounded-md px-4 py-2 bg-inherit border mb-6"
			/>

			{step !== "password" && (
				<Button
					type="button"
					onClick={handleEmailContinue}
					className="bg-primary rounded-md px-4 py-2 text-foreground mb-2"
				>
					Continue
					{step === "transitioning" && (
						<Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
					)}
				</Button>
			)}
			{step === "password" && (
				<>
					<Label className="text-md" htmlFor="password">
						Password
					</Label>
					<Input
						ref={passwordRef}
						id="password"
						type="password"
						placeholder="••••••••"
						required
						className="rounded-md px-4 py-2 bg-inherit border mb-6"
					/>
					<SubmitButton
						disabled={isPending}
						formAction={() => handleAuthAction(signIn)}
						className="bg-primary rounded-md px-4 py-2 text-foreground mb-2"
					>
						Sign In
						{isPending && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
					</SubmitButton>
					<SubmitButton
						disabled={isPending}
						formAction={() => handleAuthAction(signUp)}
						className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
					>
						Sign Up
					</SubmitButton>
				</>
			)}
		</form>
	);
}
