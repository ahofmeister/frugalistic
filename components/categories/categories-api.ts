"use server";

import { revalidateTag } from "next/cache";

import type { NewCategory } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function createCategory(newCategory: NewCategory) {
	const supabase = await createClient();

	const { error } = await supabase.from("categories").upsert(newCategory);
	if (error) {
		console.log(error);
	}

	revalidateTag("category", { expire: 10 });
}

export async function deleteCategory(id: string) {
	const supabase = await createClient();
	await supabase.from("categories").delete().eq("id", id);
	revalidateTag("category", { expire: 10 });
}
