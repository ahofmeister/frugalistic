import { notFound } from "next/navigation";
import { Suspense } from "react";
import { dbTransaction } from "@/drizzle/client";
import WebhookForm from "@/features/webhooks/webhook-form";

async function WebhookFormWithData({ webhookId }: { webhookId: Promise<string> }) {
	const id = await webhookId;
	const webhook = await dbTransaction((tx) => {
		return tx.query.webhookSchema.findFirst({
			where: {
				id: id,
			},
		});
	});

	if (!webhook) {
		notFound();
	}

	return <WebhookForm webhook={webhook} />;
}

const WebhookPage = ({ params }: { params: Promise<{ id: string }> }) => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<WebhookFormWithData webhookId={params.then((p) => p.id)} />
		</Suspense>
	);
};

export default WebhookPage;
