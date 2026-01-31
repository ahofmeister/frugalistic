"use server";
import { createClient } from "@/utils/supabase/server";

export async function addFeedback(feedback: string) {
	const supabase = await createClient();

	const { data, error } = await supabase.from("feedback").upsert({ text: feedback }).select();

	if (error) {
		console.log(error);
	}
	return data;
}
