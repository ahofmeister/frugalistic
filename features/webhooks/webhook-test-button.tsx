"use client";
import { useTransition } from "react";
import type { webhookSchema } from "@/drizzle/schema";
import { Button } from "@/features/ui/button";
import { Spinner } from "@/features/ui/spinner";
import { testWebhook } from "@/features/webhooks/webhook-actions";

const WebhookTestButton = ({ webhook }: { webhook: typeof webhookSchema.$inferSelect }) => {
	const [isPending, startTransition] = useTransition();

	return (
		<Button
			type="button"
			onClick={() =>
				startTransition(async () => {
					await testWebhook(webhook);
				})
			}
		>
			{isPending ? <Spinner /> : "Test Webhook"}
		</Button>
	);
};

export default WebhookTestButton;
