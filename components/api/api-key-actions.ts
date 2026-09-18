"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateApiKey } from "@/components/api/api-utils";
import { dbTransaction } from "@/drizzle/client";
import { apiKeySchema } from "@/drizzle/schema/api-key-schema";

const createApiKeySchema = z.object({
	name: z.string().min(1),
	expiresAt: z.coerce.date().optional(),
});

export async function getApiKeys() {
	return dbTransaction((tx) => {
		return tx.select().from(apiKeySchema).orderBy(desc(apiKeySchema.createdAt));
	});
}

export async function createApiKey(input: z.infer<typeof createApiKeySchema>) {
	const parsed = createApiKeySchema.parse(input);
	const { key, keyHash, keyPrefix } = generateApiKey();

	const apiKey = await dbTransaction(async (tx) => {
		const [created] = await tx
			.insert(apiKeySchema)
			.values({
				name: parsed.name,
				keyHash,
				keyPrefix,
				expiresAt: parsed.expiresAt?.toISOString(),
			})
			.returning();

		return created;
	});

	revalidatePath("/account");

	return { ...apiKey, key };
}

export async function revokeApiKey(id: string) {
	const revoked = await dbTransaction(async (tx) => {
		const [result] = await tx
			.update(apiKeySchema)
			.set({ revoked: true })
			.where(and(eq(apiKeySchema.id, id)))
			.returning({ id: apiKeySchema.id });

		return result;
	});

	if (!revoked) {
		throw new Error("API key not found");
	}

	revalidatePath("/account");
}
