import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export default async function Login() {
	return (
		<div className="mx-auto flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
			<Suspense>
				<LoginForm />
			</Suspense>
		</div>
	);
}
