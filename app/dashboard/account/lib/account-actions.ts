"use server";
import { revalidatePath } from "next/cache";

import { UserAccountUpdate } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function updateAccount(account: UserAccountUpdate) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { error } = await supabase
      .from("user")
      .upsert({
        id: user.id,
        email: user.email,
        ...account,
      })
      .eq("id", user.id);

    if (error) {
      console.log(error);
    }
    revalidatePath("/page");
  }
}
