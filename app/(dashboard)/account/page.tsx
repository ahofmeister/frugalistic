import { Suspense } from "react";
import { AccountProfileSection } from "@/app/(dashboard)/account/accountProfileSection";
import DeleteAccount from "@/app/(dashboard)/account/components/delete-account";
import UpdatePassword from "@/app/(dashboard)/account/components/update-password-form";

export default async function AccountPage() {
	return (
		<div className="min-h-screen flex justify-center">
			<div className="flex flex-col max-w-2xl gap-y-4">
				<div className="text-2xl font-bold">Account</div>

				<Suspense>
					<AccountProfileSection />
				</Suspense>
				<UpdatePassword />

				<DeleteAccount />
			</div>
		</div>
	);
}
