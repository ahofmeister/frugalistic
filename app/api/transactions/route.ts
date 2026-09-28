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

type ImportTargetResult =
	| { ok: true; accountId: string; categoryId: string }
	| { ok: false; error: string; status: number };

async function canWriteToAccount(userId: string, accountId: string): Promise<boolean> {
	const account = await db.query.accountSchema.findFirst({
		columns: { userId: true },
		where: { id: accountId },
	});

	if (!account) {
		return false;
	}

	if (account.userId === userId) {
		return true;
	}

	const membership = await db.query.accountMemberSchema.findFirst({
		columns: { role: true },
		where: { accountId, memberId: userId },
	});

	return membership?.role === "write";
}

async function resolveImportTarget(userId: string): Promise<ImportTargetResult> {
	const profile = await db.query.profiles.findFirst({
		columns: { activeAccountId: true },
		where: { id: userId },
	});

	const accountId = profile?.activeAccountId;

	if (!accountId) {
		return { ok: false, error: "No active account selected", status: 400 };
	}

	if (!(await canWriteToAccount(userId, accountId))) {
		return { ok: false, error: "No write access to the active account", status: 403 };
	}

	const setting = await db.query.settingSchema.findFirst({
		columns: { importDefaultCategory: true },
		where: { userId },
	});

	const categoryId = setting?.importDefaultCategory;

	if (!categoryId) {
		return { ok: false, error: "Please set default import category in settings", status: 400 };
	}

	const category = await db.query.categories.findFirst({
		columns: { id: true },
		where: { id: categoryId, accountId },
	});

	if (!category) {
		return {
			ok: false,
			error: "The default import category does not belong to the active account",
			status: 400,
		};
	}

	return { ok: true, accountId, categoryId };
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

async function findAlreadyImportedIds(
	accountId: string,
	externalIds: string[],
): Promise<Set<string>> {
	const existingTransactions = await db
		.select({ externalId: transactions.externalId })
		.from(transactions)
		.where(
			and(eq(transactions.accountId, accountId), inArray(transactions.externalId, externalIds)),
		);

	const ids = existingTransactions
		.map((transaction) => transaction.externalId)
		.filter((id): id is string => id !== null);

	return new Set(ids);
}

function buildImportRows(
	incoming: z.infer<typeof transactionInsertSchema>,
	alreadyImported: Set<string>,
	userId: string,
	accountId: string,
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
			accountId,
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
			await db.insert(transactions).values(row);
		} catch (error) {
			console.error(error);
			errors.set(row.externalId, "Database error");
		}
	}

	return errors;
}

export const POST = withApiAuth(async (request: NextRequest, userId: string) => {
	const target = await resolveImportTarget(userId);

	if (!target.ok) {
		return Response.json({ error: target.error }, { status: target.status });
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
		target.accountId,
		parsed.data.map((t) => t.externalId),
	);

	const { toInsert, rowResults } = buildImportRows(
		parsed.data,
		alreadyImported,
		userId,
		target.accountId,
		target.categoryId,
	);

	const insertErrors = await insertTransactionRows(toInsert);

	const finalResults = rowResults.map((row) => {
		const error = insertErrors.get(row.externalId);
		return error ? { ...row, status: "error" as const, error } : row;
	});

	return Response.json(finalResults, { status: 200 });
});
