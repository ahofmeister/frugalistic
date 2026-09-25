"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/components/auth/auth-actions";
import { dbTransaction } from "@/drizzle/client";
import { profiles } from "@/drizzle/schema";

// TODO proper error handling
export async function switchActiveAccount(accountId: string) {
	const user = await getCurrentUser();

	if (!user) {
		throw new Error(`Cannot switch active account with id ${accountId}`);
	}

	const membership = await dbTransaction((tx) => {
		return tx.query.accountMemberSchema.findFirst({
			where: {
				accountId: accountId,
				memberId: user.id,
			},
		});
	});
	if (!membership) {
		throw new Error("Not a member of this account");
	}

	await dbTransaction((tx) => {
		return tx.update(profiles).set({ activeAccountId: accountId }).where(eq(profiles.id, user.id));
	});

	revalidatePath("/", "layout");
}

export async function getActiveAccountId() {
	const user = await getCurrentUser();

	if (!user) {
		throw new Error("Not authenticated");
	}

	const userId = user.id;

	const profile = await dbTransaction((tx) => {
		return tx.query.profiles.findFirst({
			where: { id: userId },
		});
	});

	if (!profile?.activeAccountId) {
		throw new Error("No active account set");
	}

	return profile.activeAccountId;
}

export async function getActiveAccountName() {
	const accountId = await getActiveAccountId();

	const account = await dbTransaction((tx) => {
		return tx.query.accountSchema.findFirst({
			where: {
				id: accountId,
			},
		});
	});

	if (!account) {
		throw new Error("No active account set");
	}

	return account.name;
}
