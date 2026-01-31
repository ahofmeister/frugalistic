"use server";
import { revalidatePath } from "next/cache";

import type { Setting, SettingUpdate } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function updateSettings(setting: SettingUpdate) {
	const supabase = await createClient();

	const { error } = await supabase.from("setting").upsert(setting).select();

	if (error) {
		console.log(error);
	}
	revalidatePath("/", "layout");
}

export async function getSettings(): Promise<Setting> {
	const supabase = await createClient();
	const { data: settings } = await supabase.from("setting").select("*").single();

	return settings ?? ({ date_format: "dd.MM.yyyy" } as Setting);
}
