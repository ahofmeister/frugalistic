import { Suspense } from "react";
import AccountList from "@/app/(dashboard)/accounts/account-list";
import ShareAccountButton from "@/components/account/share-account-button";

const AccountPage = async () => {
	return (
		<div className="flex flex-col max-w-4xl mx-auto">
			<div className="self-end">
				<ShareAccountButton />
			</div>
			<Suspense>
				<AccountList />
			</Suspense>
		</div>
	);
};

export default AccountPage;
