"use client";
import { removeAccountSharing } from "@/features/account/account-actions";
import { Button } from "@/features/ui/button";

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
