import { notFound } from "next/navigation";
import { Suspense } from "react";
import { dbTransaction } from "@/drizzle/client";
import { Dialog, DialogContent, DialogTrigger } from "@/features/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/features/ui/table";
import WebhookEventDeleteButton from "@/features/webhooks/webhook-event-delete-button";
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

async function WebhookEvents({ webhookId }: { webhookId: Promise<string> }) {
	const id = await webhookId;

	const events = await dbTransaction(async (tx) => {
		return tx.query.webhookEventSchema.findMany({
			with: {
				webhook: true,
			},
			where: {
				webhookId: id,
			},
			orderBy: {
				executedAt: "desc",
			},
		});
	});

	if (events.length === 0) {
		return;
	}

	return (
		<Table className="max-w-3xl mx-auto">
			<TableHeader>
				<TableRow>
					<TableHead>Date</TableHead>
					<TableHead>HTTP Method</TableHead>
					<TableHead>URL</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Type</TableHead>
					<TableHead>Test</TableHead>
					<TableHead>Body</TableHead>
					<TableHead>&nbsp;</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{events?.map((event) => {
					return (
						<TableRow key={event.id}>
							<TableCell>{event.executedAt}</TableCell>
							<TableCell>{event.httpMethod}</TableCell>
							<TableCell>{event.url}</TableCell>
							<TableCell>{event.statusCode}</TableCell>
							<TableCell>{event.type}</TableCell>
							<TableCell>{event.test ? "Yes" : ""}</TableCell>
							<TableCell>
								<Dialog>
									<DialogTrigger className="cursor-pointer">Show body</DialogTrigger>
									<DialogContent className="min-w-fit">
										<pre>{JSON.stringify(event.body, undefined, 2)}</pre>
									</DialogContent>
								</Dialog>
							</TableCell>
							<TableCell>
								<WebhookEventDeleteButton id={event.id} />
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}

const WebhookPage = ({ params }: { params: Promise<{ id: string }> }) => {
	return (
		<>
			<Suspense fallback={<div>Loading...</div>}>
				<WebhookFormWithData webhookId={params.then((p) => p.id)} />
			</Suspense>

			<Suspense>
				<WebhookEvents webhookId={params.then((p) => p.id)} />
			</Suspense>
		</>
	);
};

export default WebhookPage;
