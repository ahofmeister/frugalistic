import { Suspense } from "react";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";

export default function ForgotPasswordPage() {
	return (
		<Suspense>
			<ForgotPasswordForm />
		</Suspense>
	);
}
