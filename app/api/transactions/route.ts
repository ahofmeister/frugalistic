import { and, eq, inArray } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { apiTransactionInsertSchema } from "@/components/api/api-transaction-type";
import { withApiAuth } from "@/components/api/api-utils";
import { db } from "@/drizzle/client";
import { transactions } from "@/drizzle/schema";

const transactionInsertSchema = apiTransactionInsertSchema.array().min(1).max(500);

type RowResult = {
	externalId: string;
	status: "created" | "skipped" | "error";
	error?: string;
};

async function getImportDefaultCategoryId(userId: string): Promise<string | null> {
	const category = await db.transaction((tx) => {
		return tx.query.settingSchema.findFirst({
			columns: {
				importDefaultCategory: true,
			},
			where: {
				userId: {
					eq: userId,
				},
			},
		});
	});

	return category?.importDefaultCategory ?? null;
}

async function parseRequestBody(request: NextRequest): Promise<unknown | null> {
	try {
		return await request.json();
	} catch (error) {
		console.log(error);
		return null;
	}
}

function parseTransactions(body: unknown) {
	return transactionInsertSchema.safeParse(body);
}

async function findAlreadyImportedIds(userId: string, externalIds: string[]): Promise<Set<string>> {
	const existingTransactions = await db
		.select({ externalId: transactions.externalId })
		.from(transactions)
		.where(and(eq(transactions.userId, userId), inArray(transactions.externalId, externalIds)));

	const ids = existingTransactions
		.map((transaction) => transaction.externalId)
		.filter((id): id is string => id !== null);

	return new Set(ids);
}

function buildImportRows(
	incoming: z.infer<typeof transactionInsertSchema>,
	alreadyImported: Set<string>,
	userId: string,
	categoryId: string,
) {
	const rowResults: RowResult[] = [];
	const toInsert: (typeof transactions.$inferInsert & { externalId: string })[] = [];

	for (const row of incoming) {
		if (alreadyImported.has(row.externalId)) {
			rowResults.push({ externalId: row.externalId, status: "skipped" });
			continue;
		}

		toInsert.push({
			userId,
			externalId: row.externalId,
			description: row.description,
			datetime: row.datetime,
			amount: row.amount,
			type: row.type,
			categoryId,
			costType: row.costType ?? "variable",
		});
		rowResults.push({ externalId: row.externalId, status: "created" });
	}

	return { toInsert, rowResults };
}

async function insertTransactionRows(
	toInsert: (typeof transactions.$inferInsert & { externalId: string })[],
): Promise<Map<string, string>> {
	const errors = new Map<string, string>();

	for (const row of toInsert) {
		try {
			await db.transaction((tx) => {
				return tx.insert(transactions).values(row);
			});
		} catch (error) {
			console.error(error);
			errors.set(row.externalId, "Database error");
		}
	}

	return errors;
}

export const POST = withApiAuth(async (request: NextRequest, userId: string) => {
	const categoryId = await getImportDefaultCategoryId(userId);

	if (!categoryId) {
		console.error("Import category not found.");
		return Response.json(
			{ error: "Please set default import category in settings" },
			{ status: 400 },
		);
	}

	const body = await parseRequestBody(request);

	if (body === null) {
		return Response.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	const parsed = parseTransactions(body);

	if (!parsed.success) {
		const structuredErrors = z.treeifyError(parsed.error);
		return Response.json({ error: structuredErrors }, { status: 400 });
	}

	const alreadyImported = await findAlreadyImportedIds(
		userId,
		parsed.data.map((t) => t.externalId),
	);

	const { toInsert, rowResults } = buildImportRows(
		parsed.data,
		alreadyImported,
		userId,
		categoryId,
	);

	const insertErrors = await insertTransactionRows(toInsert);

	const finalResults = rowResults.map((row) => {
		const error = insertErrors.get(row.externalId);
		return error ? { ...row, status: "error" as const, error } : row;
	});

	return Response.json(finalResults, { status: 200 });
});
