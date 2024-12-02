"use server";
import { revalidateTag } from "next/cache";

import { ProfileUpdate } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function updateAccount(account: ProfileUpdate) {
  const supabase = createClient("profile");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { error } = await supabase
      .from("profile")
      .upsert({
        id: user.id,
        email: user.email,
        ...account,
      })
      .eq("id", user.id);

    if (error) {
      console.log(error);
    }
    revalidateTag("profile");
  }
}

export async function deleteAccount() {
  const supabase = createClient("profile");

  const { error } = await supabase.rpc("delete_user");

  if (error) {
    console.log(error);
  }
}
