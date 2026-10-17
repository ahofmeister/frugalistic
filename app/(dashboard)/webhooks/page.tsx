import { CheckIcon } from "@radix-ui/react-icons";
import { PencilIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { dbTransaction } from "@/drizzle/client";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/features/ui/table";

async function WebhooksList() {
	const webhooks = await dbTransaction((tx) => {
		return tx.query.webhookSchema.findMany();
	});

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableCell>Name</TableCell>
					<TableCell>URL</TableCell>
					<TableCell>Description</TableCell>
					<TableCell>HTTP Method</TableCell>
					<TableCell>Event Type</TableCell>
					<TableCell>Active</TableCell>
					<TableCell></TableCell>
				</TableRow>
			</TableHeader>
			<TableBody>
				{webhooks.map((webhook) => (
					<TableRow key={webhook.id}>
						<TableCell>{webhook.name}</TableCell>
						<TableCell>{webhook.url}</TableCell>
						<TableCell>{webhook.description}</TableCell>
						<TableCell>{webhook.httpMethod}</TableCell>
						<TableCell>{webhook.eventType}</TableCell>
						<TableCell>{webhook.active ? <CheckIcon /> : <XIcon />}</TableCell>
						<TableCell>
							<Link href={`/webhooks/${webhook.id}`}>
								<PencilIcon size={14} />
							</Link>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

const WebhookPage = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<WebhooksList />
		</Suspense>
	);
};

export default WebhookPage;
