import { type NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "@/utils/supabase/server";

export async function middleware(request: NextRequest) {
  await updateSession(request);
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathName = request.nextUrl.pathname;
  if (!user && pathName.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: steps } = await supabase.from("onboarding_steps").select();

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

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
