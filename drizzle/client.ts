import "server-only";

import { type DrizzleConfig, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { cookies } from "next/headers";
import postgres from "postgres";
import { relations } from "@/drizzle/schema/relations";
import { ACCESS_COOKIE, verifyAccessToken } from "@/lib/auth/session";

const config = {
	relations: relations,
} satisfies DrizzleConfig<typeof relations>;

declare namespace global {
	let postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

let postgresSqlClient: ReturnType<typeof postgres>;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL environment variable is not set");
}

if (process.env.NODE_ENV !== "production") {
	if (!global.postgresSqlClient) {
		global.postgresSqlClient = postgres(databaseUrl, { prepare: false });
	}
	postgresSqlClient = global.postgresSqlClient;
} else {
	postgresSqlClient = postgres(databaseUrl, { prepare: false });
}

export const db = drizzle({
	client: postgresSqlClient,
	...config,
	logger: false,
});

export async function rlsDb() {
	const store = await cookies();
	const token = await verifyAccessToken(store.get(ACCESS_COOKIE)?.value ?? "");

	const runTransaction = ((transaction, config) => {
		return db.transaction(async (tx) => {
			try {
				await tx.execute(sql`
					select set_config('request.jwt.claims', '${sql.raw(JSON.stringify(token))}', TRUE);
					select set_config('request.jwt.claim.sub', '${sql.raw(token.sub ?? "")}', TRUE);
					set local role ${sql.raw(token.role || "anon")};
				`);

				const result = await transaction(tx);

				await tx.execute(sql`
					select set_config('request.jwt.claims', NULL, TRUE);
					select set_config('request.jwt.claim.sub', NULL, TRUE);
					reset role;
				`);

				return result;
			} catch (error) {
				console.error("Transaction failed:", {
					error,
					message: error instanceof Error ? error.message : "Unknown error",
					stack: error instanceof Error ? error.stack : undefined,
					userId: token.sub,
					role: token.role,
				});
				throw error;
			}
		}, config);
	}) as typeof db.transaction;

	return {
		runTransaction,
	};
}

type TransactionClient = Parameters<Parameters<typeof db.transaction>[0]>[0];

export async function dbTransaction<T>(fn: (tx: TransactionClient) => Promise<T>): Promise<T> {
	const client = await rlsDb();
	return client.runTransaction(fn);
}
