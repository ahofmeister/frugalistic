import { Suspense } from "react";
import { signIn, signUp } from "@/components/auth/auth-actions";
import { SubmitButton } from "@/components/auth/submit-button";

export default async function Login(props: {
	searchParams: Promise<{ message: string }>;
}) {
	return (
		<div className="mx-auto flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
			<form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
				<Suspense>
					<label className="text-md" htmlFor="email">
						Email
					</label>
					<input
						className="rounded-md px-4 py-2 bg-inherit border mb-6"
						name="email"
						placeholder="you@example.com"
						required
					/>
					<label className="text-md" htmlFor="password">
						Password
					</label>
					<input
						className="rounded-md px-4 py-2 bg-inherit border mb-6"
						type="password"
						name="password"
						placeholder="••••••••"
						required
					/>

					<Suspense>
						<SubmitButton
							formAction={signIn}
							className="bg-primary rounded-md px-4 py-2 text-foreground mb-2"
						>
							Sign In
						</SubmitButton>
					</Suspense>
					<Suspense>
						<SubmitButton
							formAction={signUp}
							className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
						>
							Sign Up
						</SubmitButton>
					</Suspense>
				</Suspense>
				<Suspense>
					{props.searchParams.then((param) => {
						if (!param.message) {
							return null;
						}

						return (
							<p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
								{param.message}
							</p>
						);
					})}
				</Suspense>
			</form>
		</div>
	);
}
