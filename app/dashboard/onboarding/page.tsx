import { createClient } from "@/utils/supabase/server";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export default async function OnboardingPage() {
  const supabase = createClient();
  const { data: steps, error } = await supabase
    .from("onboarding_steps")
    .select("*")
    .order("step_order", {
      ascending: true,
    });

  if (error) {
    console.log(error);
  }

  if (!steps) {
    return <></>;
  }

  return <OnboardingFlow steps={steps ?? []} />;
}
