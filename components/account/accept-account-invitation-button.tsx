"use client";
import { acceptAccountInvitation } from "@/components/account/account-actions";
import { Button } from "@/components/ui/button";
import type { AccountRole } from "@/drizzle/schema";

export function AcceptAccountInvitationButton({
	accountId,
	memberId,
	role,
	invitationId,
}: {
	accountId: string;
	memberId: string;
	role: AccountRole;
	invitationId: string;
}) {
	return (
		<Button
			variant="success"
			size="sm"
			onClick={async () => {
				await acceptAccountInvitation(accountId, memberId, role, invitationId);
			}}
		>
			Accept
		</Button>
	);
}
