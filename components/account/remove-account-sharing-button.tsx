"use client";
import { removeAccountSharing } from "@/components/account/account-actions";
import { Button } from "@/components/ui/button";

export function RemoveAccountSharingButton({
	accountId,
	memberId,
}: {
	accountId: string;
	memberId: string;
}) {
	return (
		<Button
			variant="destructive"
			size="sm"
			onClick={() => removeAccountSharing(accountId, memberId)}
		>
			Stop sharing
		</Button>
	);
}
