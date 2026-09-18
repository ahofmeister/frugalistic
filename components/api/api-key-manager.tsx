"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow } from "date-fns";
import { Copy, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createApiKey, revokeApiKey } from "@/components/api/api-key-actions";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { apiKeySchema } from "@/drizzle/schema/api-key-schema";

const createApiKeyFormSchema = z.object({
	name: z.string().min(1),
});

export function ApiKeyManager({
	initialKeys,
}: {
	initialKeys: (typeof apiKeySchema.$inferSelect)[];
}) {
	const [keys, setKeys] = useState(initialKeys);
	const [createOpen, setCreateOpen] = useState(false);
	const [revealedKey, setRevealedKey] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof createApiKeyFormSchema>>({
		resolver: zodResolver(createApiKeyFormSchema),
		defaultValues: { name: "" },
		mode: "onChange",
	});

	function handleCreate(values: z.infer<typeof createApiKeyFormSchema>) {
		startTransition(async () => {
			try {
				const created = await createApiKey(values);

				setKeys((prev) => [
					{
						id: created.id,
						name: created.name,
						keyPrefix: created.keyPrefix,
						lastUsedAt: null,
						expiresAt: null,
						revoked: false,
						createdAt: new Date().toISOString(),
						userId: created.userId,
						keyHash: created.keyHash,
					},
					...prev,
				]);
				setRevealedKey(created.key);
				form.reset();
				setCreateOpen(false);
			} catch {
				toast.error("Failed to create API key");
			}
		});
	}

	function handleRevoke(id: string) {
		startTransition(async () => {
			try {
				await revokeApiKey(id);
				setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, revoked: true } : k)));
			} catch {
				toast.error("Failed to revoke API key");
			}
		});
	}

	function handleCopy(key: string) {
		navigator.clipboard.writeText(key).then(() => toast.success("Copied to clipboard"));
	}

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<Dialog open={createOpen} onOpenChange={setCreateOpen}>
					<DialogTrigger asChild>
						<Button size="sm">
							<Plus className="h-4 w-4 mr-2" />
							New API Key
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create API Key</DialogTitle>
							<DialogDescription>Give it a name so you can recognize it later.</DialogDescription>
						</DialogHeader>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel required>Name</FormLabel>
											<FormControl>
												<Input placeholder="My import script" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<DialogFooter>
									<Button type="submit" disabled={isPending || !form.formState.isValid}>
										Create
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</div>

			{revealedKey && (
				<div className="rounded-md border border-primary/50 bg-primary/5 p-4 space-y-2">
					<p className="text-sm font-medium">Copy your key now — you won't see it again.</p>
					<div className="flex items-center gap-2">
						<code className="flex-1 text-xs bg-muted rounded px-2 py-1.5 overflow-x-auto">
							{revealedKey}
						</code>
						<Button size="icon" variant="outline" onClick={() => handleCopy(revealedKey)}>
							<Copy className="h-4 w-4" />
						</Button>
					</div>
					<Button variant="ghost" size="sm" onClick={() => setRevealedKey(null)}>
						Dismiss
					</Button>
				</div>
			)}

			{keys.length === 0 ? (
				<p className="text-sm text-muted-foreground">No API keys yet.</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Key</TableHead>
							<TableHead>Last used</TableHead>
							<TableHead>Status</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						{keys.map((key) => (
							<TableRow key={key.id}>
								<TableCell>{key.name}</TableCell>
								<TableCell className="font-mono text-xs">{key.keyPrefix}••••••••</TableCell>
								<TableCell className="text-sm text-muted-foreground">
									{key.lastUsedAt
										? formatDistanceToNow(new Date(key.lastUsedAt), { addSuffix: true })
										: "Never"}
								</TableCell>
								<TableCell>
									{key.revoked ? (
										<Badge variant="destructive">Revoked</Badge>
									) : (
										<Badge variant="secondary">Active</Badge>
									)}
								</TableCell>
								<TableCell>
									{!key.revoked && (
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button size="icon" variant="ghost">
													<Trash2 className="h-4 w-4" />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>Revoke "{key.name}"?</AlertDialogTitle>
													<AlertDialogDescription>
														Any requests using this key will stop working immediately. This can't be
														undone.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction onClick={() => handleRevoke(key.id)}>
														Revoke
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
