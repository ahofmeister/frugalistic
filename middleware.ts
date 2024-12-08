import { type NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "@/utils/supabase/server";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  const pathName = request.nextUrl.pathname;
  const supabase = await createClient();

  if (pathName.startsWith("/dashboard")) {
    const { data: onboardingSteps } = await supabase
      .from("onboarding_steps")
      .select("*")
      .neq("status", "complete")
      .neq("status", "skip");

    const hasIncompleteOnboardingSteps =
      onboardingSteps && onboardingSteps?.length > 0;

    if (!hasIncompleteOnboardingSteps && pathName == "/dashboard/onboarding") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (hasIncompleteOnboardingSteps && pathName !== "/dashboard/onboarding") {
      return NextResponse.redirect(
        new URL("/dashboard/onboarding", request.url),
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
