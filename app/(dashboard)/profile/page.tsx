import { Suspense } from "react";
import { AccountApiKeys } from "@/components/profile/account-api-keys";
import { AccountProfileSection } from "@/components/profile/account-profile-section";
import DeleteAccount from "@/components/profile/delete-account";
import UpdatePasswordForm from "@/components/profile/update-password-form";

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
