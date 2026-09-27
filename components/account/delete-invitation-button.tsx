"use client";
import { deleteAccountInvitation } from "@/components/account/account-actions";
import { Button } from "@/components/ui/button";

export function DeleteInvitationButton({ id, label }: { id: string; label: string }) {
	return (
		<Button variant="destructive" size="sm" onClick={() => deleteAccountInvitation(id)}>
			{label}
		</Button>
	);
}
