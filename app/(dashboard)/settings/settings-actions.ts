"use server";
import { revalidatePath } from "next/cache";
import { dbTransaction } from "@/drizzle/client";
import { settingSchema } from "@/drizzle/schema";
import { getActiveAccountId } from "@/features/account/account-actions";

export async function updateSettings(
	setting: Omit<typeof settingSchema.$inferInsert, "id" | "userId" | "accountId">,
) {
	const accountId = await getActiveAccountId();

	await dbTransaction((tx) => {
		return tx
			.insert(settingSchema)
			.values({ ...setting, accountId })
			.onConflictDoUpdate({
				target: [settingSchema.userId, settingSchema.accountId],
				set: setting,
			});
	});

	revalidatePath("/", "layout");
}
export async function getSettings() {
	const accountId = await getActiveAccountId();
	const settings = await dbTransaction((tx) => {
		return tx.query.settingSchema.findFirst({
			where: {
				accountId: accountId,
			},
		});
	});

	return settings ?? ({ dateFormat: "dd.MM.yyyy" } as typeof settingSchema.$inferSelect);
}
