"use server";
import { revalidateTag } from "next/cache";

import { ProfileUpdate } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function updateAccount(account: ProfileUpdate) {
  const supabase = await createClient();

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
  const supabase = await createClient();

  const { error } = await supabase.rpc("delete_user");

  if (error) {
    console.log(error);
  }
}

export async function updatePassword(
  passwordData: UpdatePasswordFormData,
): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("verify_user_password", {
    password: passwordData.currentPassword,
  });

  if (!data) {
    return { success: false, message: "Current password is not correct" };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordData.newPassword,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "" };
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
