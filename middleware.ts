import { type NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "@/utils/supabase/server";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  const pathName = request.nextUrl.pathname;

  const { data: steps } = await createClient()
    .from("onboarding_steps")
    .select();

  if (pathName.startsWith("/dashboard")) {
    const hasIncompleteStep = steps?.some(
      (step) =>
        !step.status.includes("complete") && !step.status.includes("skipped"),
    );

    if (!hasIncompleteStep && pathName == "/dashboard/onboarding") {
      const url = new URL("/dashboard", request.url);
      return NextResponse.redirect(url);
    }

    if (hasIncompleteStep && pathName !== "/dashboard/onboarding") {
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
