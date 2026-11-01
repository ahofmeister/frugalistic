import { addSeconds, fromUnixTime, isBefore } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { type NextRequest, NextResponse } from "next/server";
import { type GoTrueSession, refreshSession } from "@/lib/auth/gotrue";
import {
	ACCESS_COOKIE,
	clearSessionCookies,
	REFRESH_COOKIE,
	verifyAccessToken,
	writeSessionCookies,
} from "@/lib/auth/session";

function isExpiring(accessToken: string | undefined) {
	if (!accessToken) {
		return true;
	}
	try {
		const { exp } = jwtDecode(accessToken);
		return !exp || isBefore(fromUnixTime(exp), addSeconds(new Date(), 60));
	} catch {
		return true;
	}
}

export async function proxy(request: NextRequest) {
	let currentToken = request.cookies.get(ACCESS_COOKIE)?.value;
	const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
	let refreshed: GoTrueSession | null = null;
	let shouldClear = false;

	if (refreshToken && isExpiring(currentToken)) {
		const result = await refreshSession(refreshToken);
		if (result.ok) {
			refreshed = result.data;
			currentToken = result.data.access_token;
			request.cookies.set(ACCESS_COOKIE, result.data.access_token);
			request.cookies.set(REFRESH_COOKIE, result.data.refresh_token);
		} else {
			shouldClear = true;
			currentToken = undefined;
		}
	}

	const claims = await verifyAccessToken(currentToken ?? "");

	if (!claims.sub && request.nextUrl.pathname.startsWith("/dashboard")) {
		console.log(claims);
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/login";
		const redirect = NextResponse.redirect(redirectUrl);
		if (shouldClear) {
			clearSessionCookies(redirect.cookies);
		}
		return redirect;
	}

	const response = NextResponse.next({ request });
	if (refreshed) {
		writeSessionCookies(response.cookies, refreshed);
	}
	if (shouldClear) {
		clearSessionCookies(response.cookies);
	}
	return response;
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
