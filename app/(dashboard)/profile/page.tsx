import { Suspense } from "react";
import { AccountApiKeys } from "@/features/profile/account-api-keys";
import { AccountProfileSection } from "@/features/profile/account-profile-section";
import DeleteAccount from "@/features/profile/delete-account";
import UpdatePasswordForm from "@/features/profile/update-password-form";

export default async function AccountPage() {
	return (
		<div className="min-h-screen flex justify-center">
			<div className="flex flex-col max-w-2xl gap-y-8">
				<div className="text-2xl font-bold">Account</div>

				<Suspense>
					<AccountProfileSection />
				</Suspense>
				<UpdatePasswordForm />

				<Suspense>
					<AccountApiKeys />
				</Suspense>

				<DeleteAccount />
			</div>
		</div>
	);
}
