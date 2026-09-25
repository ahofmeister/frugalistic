"use client";
import { useTransition } from "react";
import { switchActiveAccount } from "@/components/account/account-actions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

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
