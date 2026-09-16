"use server";
import { revalidatePath } from "next/cache";
import { dbTransaction } from "@/drizzle/client";
import { settingSchema } from "@/drizzle/schema";

export async function updateSettings(setting: typeof settingSchema.$inferInsert) {
	await dbTransaction((tx) => {
		return tx.update(settingSchema).set(setting);
	});

	revalidatePath("/", "layout");
}

export async function getSettings() {
	const settings = await dbTransaction((tx) => {
		return tx.query.settingSchema.findFirst();
	});

	return settings ?? ({ dateFormat: "dd.MM.yyyy" } as typeof settingSchema.$inferSelect);
}
