import { type NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "@/utils/supabase/server";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  const pathName = request.nextUrl.pathname;
  const supabase = await createClient();
  const { data: hasIncompleteOnboardingSteps } = await supabase.rpc(
    "has_incomplete_onboarding_steps",
  );

  if (pathName.startsWith("/dashboard")) {
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
