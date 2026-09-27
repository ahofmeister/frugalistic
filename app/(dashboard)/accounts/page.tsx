import { Suspense } from "react";
import AccountList from "@/app/(dashboard)/accounts/account-list";
import AccountInvitations from "@/components/account/account-invitations";
import AccountInviteButton from "@/components/account/account-invite-button";

const AccountPage = async () => {
	return (
		<div className="flex flex-col max-w-4xl mx-auto">
			<div className="self-end">
				<AccountInviteButton />
			</div>
			<Suspense>
				<AccountList />
			</Suspense>

			<Suspense>
				<AccountInvitations />
			</Suspense>
		</div>
	);
};

export default AccountPage;
