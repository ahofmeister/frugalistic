"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/components/auth/auth-actions";
import { db, dbTransaction } from "@/drizzle/client";
import { type AccountRole, accountMemberSchema, profiles } from "@/drizzle/schema";

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

export async function shareAccount(email: string, role: AccountRole) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return { error: "Not authenticated" };
	}

	const accountId = await getActiveAccountId();

	const invitee = await db.query.profiles.findFirst({
		where: {
			email: {
				ilike: email,
			},
		},
	});

	if (!invitee) {
		return { error: "No user found with that email" };
	}

	if (invitee.id === currentUser.id) {
		return { error: "You can't invite yourself" };
	}

	await dbTransaction((tx) => {
		return tx.insert(accountMemberSchema).values({
			accountId,
			role,
			memberId: invitee.id,
		});
	});

	return { error: null };
}

export async function removeAccountSharing(accountId: string, memberId: string) {
	const otherAccount = await db.query.accountSchema.findFirst({
		where: {
			userId: memberId,
		},
	});

	if (!otherAccount) {
		throw new Error("Not authenticated");
	}

	await db
		.update(profiles)
		.set({
			activeAccountId: otherAccount.id,
		})
		.where(eq(profiles.id, memberId));

	await db
		.delete(accountMemberSchema)
		.where(
			and(eq(accountMemberSchema.accountId, accountId), eq(accountMemberSchema.memberId, memberId)),
		);

	revalidatePath("/accounts");
}
