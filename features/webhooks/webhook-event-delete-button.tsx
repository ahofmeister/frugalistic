"use client";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/features/ui/button";
import { deleteWebhookEvent } from "./webhook-actions";

const WebhookEventDeleteButton = ({ id }: { id: string }) => {
	return (
		<Button
			size="icon"
			variant="ghost"
			onClick={async () => {
				const result = await deleteWebhookEvent(id);

				if (result.success) {
					toast.success("Successfully deleted event");
				} else {
					toast.error("Failed to delete webhook event");
				}
			}}
		>
			<TrashIcon />
		</Button>
	);
};

export default WebhookEventDeleteButton;
