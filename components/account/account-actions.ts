"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/components/auth/auth-actions";
import { db, dbTransaction } from "@/drizzle/client";
import {
	type AccountRole,
	accountInvitationSchema,
	accountMemberSchema,
	profiles,
} from "@/drizzle/schema";

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

	const { error } = await dbTransaction(async (tx) => {
		try {
			await tx.insert(accountInvitationSchema).values({
				accountId,
				fromMemberId: currentUser.id,
				toMemberId: invitee.id,
				accountRole: role,
			});
			return { error: null };
		} catch (err) {
			console.error(err);
			return { error: "Failed to send invitation" };
		}
	});

	return { error };
}

export async function deleteAccountInvitation(id: string) {
	await dbTransaction(async (tx) => {
		await tx.delete(accountInvitationSchema).where(eq(accountInvitationSchema.id, id));
	});
	revalidatePath("accounts");
}

export async function acceptAccountInvitation(
	accountId: string,
	memberId: string,
	role: AccountRole,
	invitationId: string,
) {
	await dbTransaction((tx) => {
		return tx.insert(accountMemberSchema).values({
			accountId,
			role,
			memberId,
		});
	});

	await deleteAccountInvitation(invitationId);

	revalidatePath("accounts");
}
