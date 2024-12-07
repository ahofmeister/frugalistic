"use server";
import { revalidatePath } from "next/cache";

import { createClient } from "@/utils/supabase/server";

export const nextStep = async (stepId: string) => {
  const supabase = await createClient();

  const { data: updatedStep, error } = await supabase
    .from("onboarding_steps")
    .update({
      status: "complete",
    })
    .eq("id", stepId)
    .select()
    .single();

  if (error) {
    console.log(error);
  }

  const { error: error2 } = await supabase
    .from("onboarding_steps")
    .update({
      status: "current",
    })
    .eq("step_order", updatedStep!.step_order + 1);

  if (error2) {
    console.log(error2);
  }

  revalidatePath("/dashboard/onboarding");
};
