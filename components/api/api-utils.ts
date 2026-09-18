import { createHash, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db, dbTransaction } from "@/drizzle/client";
import { apiKeySchema } from "@/drizzle/schema";

export function withApiAuth<Context>(
	handler: (request: NextRequest, userId: string, context: Context) => Promise<Response>,
) {
	return async (request: NextRequest, context: Context) => {
		const authHeader = request.headers.get("authorization");

		if (!authHeader?.startsWith("Bearer ")) {
			return Response.json({ error: "Missing API key" }, { status: 401 });
		}

		const key = authHeader.slice("Bearer ".length);
		const keyHash = hashApiKey(key);

		const record = await db.query.apiKeySchema.findFirst({
			where: {
				keyHash: keyHash,
			},
		});

		if (!record || record.revoked) {
			return Response.json({ error: "Invalid API key" }, { status: 401 });
		}

		if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
			return Response.json({ error: "API key expired" }, { status: 401 });
		}

		await dbTransaction((tx) => {
			return tx
				.update(apiKeySchema)
				.set({ lastUsedAt: new Date().toISOString() })
				.where(eq(apiKeySchema.id, record.id));
		});

		return handler(request, record.userId, context);
	};
}

const API_KEY_PREFIX = "frugalistic_";

export function generateApiKey() {
	const secret = randomBytes(32).toString("hex");
	const key = `${API_KEY_PREFIX}${secret}`;
	const keyHash = hashApiKey(key);
	const keyPrefix = key.slice(0, API_KEY_PREFIX.length + 8);

	return { key, keyHash, keyPrefix };
}

export function hashApiKey(key: string) {
	return createHash("sha256").update(key).digest("hex");
}
