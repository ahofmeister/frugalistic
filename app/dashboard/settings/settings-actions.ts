"use server";
import { revalidatePath } from "next/cache";

import { SettingUpdate } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function updateSettings(setting: SettingUpdate) {
  const supabase = await createClient();

  const { error } = await supabase.from("setting").upsert(setting).select();

  if (error) {
    console.log(error);
  }
  revalidatePath("/", "layout");
}
