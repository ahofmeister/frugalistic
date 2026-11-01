import { createRemoteJWKSet, type JWTPayload, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { GoTrueSession } from "@/lib/auth/gotrue";

export const ACCESS_COOKIE = "fr-access-token";
export const REFRESH_COOKIE = "fr-refresh-token";

const jwtSecret = process.env.JWT_SECRET;
const secret = jwtSecret ? new TextEncoder().encode(jwtSecret) : null;
const jwks =
	!secret && process.env.GOTRUE_URL
		? createRemoteJWKSet(new URL(`${process.env.GOTRUE_URL}/.well-known/jwks.json`))
		: null;

type Claims = JWTPayload & { role: string; email?: string };

type CookieStore = {
	set: (name: string, value: string, options: Record<string, unknown>) => unknown;
	delete: (name: string) => unknown;
};

export function writeSessionCookies(store: CookieStore, session: GoTrueSession) {
	const options = {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		secure: process.env.PUBLIC_URL?.startsWith("https://") ?? false,
		maxAge: 60 * 60 * 24 * 30,
	};
	store.set(ACCESS_COOKIE, session.access_token, options);
	store.set(REFRESH_COOKIE, session.refresh_token, options);
}

export function clearSessionCookies(store: CookieStore) {
	store.delete(ACCESS_COOKIE);
	store.delete(REFRESH_COOKIE);
}

export async function verifyAccessToken(accessToken: string) {
	try {
		const options = { audience: "authenticated" };
		if (secret) {
			const { payload } = await jwtVerify(accessToken, secret, options);
			return { ...payload, role: payload.role || "authenticated" } as Claims;
		}
		if (jwks) {
			const { payload } = await jwtVerify(accessToken, jwks, options);
			return { ...payload, role: payload.role || "authenticated" } as Claims;
		}
		return { role: "anon" } as Claims;
	} catch (error) {
		console.error("JWT verify failed:", error instanceof Error ? error.message : error);
		return { role: "anon" } as Claims;
	}
}

export async function getClaims() {
	const store = await cookies();
	return verifyAccessToken(store.get(ACCESS_COOKIE)?.value ?? "");
}
