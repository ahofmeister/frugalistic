"use server";

import { sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { getCurrentUser } from "@/components/auth/auth-actions";
import { dbTransaction } from "@/drizzle/client";
import { profiles } from "@/drizzle/schema";
import { createClient } from "@/utils/supabase/server";

export async function updateProfile(account: typeof profiles.$inferInsert) {
	const user = await getCurrentUser();

	if (!user) {
		return;
	}

	await dbTransaction((tx) => {
		return tx
			.insert(profiles)
			.values({
				...account,
				id: user.id,
				email: user.email,
			})
			.onConflictDoUpdate({
				target: profiles.id,
				set: {
					...account,
					email: user.email,
				},
			});
	});

	revalidateTag("profile", { expire: 10 });
}

export async function deleteAccount() {
	try {
		await dbTransaction((tx) => tx.execute(sql`select delete_user()`));
	} catch (error) {
		console.log(error);
	}
}

export async function updatePassword(
	passwordData: UpdatePasswordFormData,
): Promise<ActionResponse> {
	const [{ verify_user_password: isCorrect }] = await dbTransaction((tx) =>
		tx.execute<{ verify_user_password: boolean }>(
			sql`select verify_user_password(${passwordData.currentPassword})`,
		),
	);

	if (!isCorrect) {
		return {
			success: false,
			message: "Current password is not correct",
		};
	}

	const supabase = await createClient();
	const { error } = await supabase.auth.updateUser({
		password: passwordData.newPassword,
	});

	if (error) {
		return {
			success: false,
			message: error.message,
		};
	}

	return {
		success: true,
		message: "",
	};
}

export interface ActionResponse {
	success: boolean;
	message: string;
}

export interface UpdatePasswordFormData {
	currentPassword: string;
	newPassword: string;
	passwordConfirmation: string;
}
