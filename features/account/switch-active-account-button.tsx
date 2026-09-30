"use client";
import { useTransition } from "react";
import { switchActiveAccount } from "@/features/account/account-actions";
import { Button } from "@/features/ui/button";
import { Spinner } from "@/features/ui/spinner";

const SwitchActiveAccountButton = ({ accountId }: { accountId: string }) => {
	const [isPending, startTransition] = useTransition();
	return (
		<Button
			onClick={() => {
				startTransition(async () => {
					await switchActiveAccount(accountId);
				});
			}}
			size="sm"
		>
			{isPending ? <Spinner /> : "Switch"}
		</Button>
	);
};

export default SwitchActiveAccountButton;
