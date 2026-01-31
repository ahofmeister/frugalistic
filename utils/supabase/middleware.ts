import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/components/auth/auth-actions";

export async function updateSession(request: NextRequest) {
	const supabaseResponse = NextResponse.next({
		request,
	});

	const user = await getCurrentUser();

	if (user) {
		return supabaseResponse;
	}

	const nextPath = request.nextUrl.pathname;
	if (nextPath.startsWith("/dashboard")) {
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}
