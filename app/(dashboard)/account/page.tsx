import { Suspense } from "react";
import { AccountApiKeys } from "@/app/(dashboard)/account/account-api-keys";
import { AccountProfileSection } from "@/app/(dashboard)/account/account-profile-section";
import DeleteAccount from "@/app/(dashboard)/account/components/delete-account";
import UpdatePassword from "@/app/(dashboard)/account/components/update-password-form";

export default async function AccountPage() {
	return (
		<div className="min-h-screen flex justify-center">
			<div className="flex flex-col max-w-2xl gap-y-8">
				<div className="text-2xl font-bold">Account</div>

				<Suspense>
					<AccountProfileSection />
				</Suspense>
				<UpdatePassword />

				<Suspense>
					<AccountApiKeys />
				</Suspense>

				<DeleteAccount />
			</div>
		</div>
	);
}
