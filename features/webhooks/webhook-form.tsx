"use client";

import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-orm/zod";
import { MinusIcon, PlusIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { type Resolver, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
	type WebhookHeader,
	webhookEventTypes,
	webhookHTTPMethods,
	webhookSchema,
} from "@/drizzle/schema";
import { Button } from "@/features/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/features/ui/form";
import { Input } from "@/features/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/features/ui/select";
import { Spinner } from "@/features/ui/spinner";
import { Switch } from "@/features/ui/switch";
import { upsertWebhook } from "@/features/webhooks/webhook-actions";
import WebhookTestButton from "@/features/webhooks/webhook-test-button";

const webhookFormSchema = createInsertSchema(webhookSchema);

type WebhookFormValues = typeof webhookSchema.$inferInsert;

const WebhookForm = ({ webhook }: { webhook?: typeof webhookSchema.$inferSelect }) => {
	const form = useForm<WebhookFormValues>({
		resolver: zodResolver(webhookFormSchema) as unknown as Resolver<WebhookFormValues>,
		defaultValues: {
			name: webhook?.name ?? undefined,
			url: webhook?.url ?? undefined,
			description: webhook?.description ?? undefined,
			httpMethod: webhook?.httpMethod ?? "POST",
			active: webhook?.active ?? true,
			eventType: webhook?.eventType,
			headers: webhook?.headers ?? [],
		},
		mode: "onChange",
	});

	async function handleSubmit(webhookUpdate: typeof webhookSchema.$inferInsert) {
		const result = await upsertWebhook({
			...webhookUpdate,
			id: webhook ? webhook.id : undefined,
		});

		if (result.success) {
			toast.success(`Webhook ${webhook?.id ? "updated" : "created"} successfully`);
		}
		if (result.error) {
			toast.error(`Webhook could not be ${webhook?.id ? "updated" : "created"}`);
		}

		if (result.success && !webhook?.id) {
			redirect("/webhooks");
		}
	}

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "headers",
	});

	return (
		<div className="max-w-2xl mx-auto px-2 py-4">
			<Form {...form}>
				<DevTool control={form.control} placement={"top-right"} />
				<form
					onSubmit={form.handleSubmit((webhook) => {
						return handleSubmit(webhook);
					})}
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel required>Name</FormLabel>
									<FormControl>
										<Input placeholder="Name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="eventType"
							render={({ field }) => (
								<FormItem>
									<FormLabel required>Event Type</FormLabel>
									<FormControl>
										<Select
											value={field.value}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{webhookEventTypes.map((eventTypes) => (
													<SelectItem key={eventTypes} value={eventTypes}>
														<div>{eventTypes}</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem className="col-span-2">
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input placeholder="Description" {...field} value={field.value ?? ""} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="httpMethod"
							render={({ field }) => (
								<FormItem>
									<FormLabel required>HTTP Method</FormLabel>
									<FormControl>
										<Select
											value={field.value}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{webhookHTTPMethods.map((method) => (
													<SelectItem key={method} value={method}>
														<div>{method}</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="url"
							render={({ field }) => (
								<FormItem>
									<FormLabel required>URL</FormLabel>
									<FormControl>
										<Input placeholder="URL" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormLabel>Headers</FormLabel>
						<div className="flex flex-col gap-y-2 col-span-2">
							{fields.map((field, index) => (
								<div key={field.id} className="flex gap-2">
									<Input {...form.register(`headers.${index}.key`)} placeholder="Header name" />
									<Input {...form.register(`headers.${index}.value`)} placeholder="Value" />
									<Button size="sm" type="button" onClick={() => remove(index)}>
										<MinusIcon />
									</Button>
									{form.formState.errors.headers?.[index]?.key && (
										<p>{form.formState.errors.headers[index].key.message}</p>
									)}
								</div>
							))}
						</div>
						<div className="col-span-2">
							<Button type="button" onClick={() => append({ key: "", value: "" })}>
								<PlusIcon />
								Add header
							</Button>
						</div>

						<FormField
							control={form.control}
							name="active"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Active</FormLabel>
									<Switch
										checked={field.value}
										onCheckedChange={(value) => {
											field.onChange(value);
										}}
									></Switch>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex col-span-2 gap-x-10 justify-between">
							<Button
								className="w-full"
								type="submit"
								disabled={form.formState.isSubmitting || !form.formState.isValid}
							>
								{form.formState.isSubmitting ? <Spinner /> : webhook ? "Save" : "Create Webhook"}
							</Button>
							{webhook && <WebhookTestButton webhook={webhook} />}
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default WebhookForm;
