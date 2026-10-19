"use client";
import { useTransition } from "react";
import { toast } from "sonner";
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
					const result = await testWebhook(webhook);

					if (result.success) {
						toast.success("Webhook tested");
					}
				})
			}
		>
			{isPending ? <Spinner /> : "Test Webhook"}
		</Button>
	);
};

export default WebhookTestButton;
