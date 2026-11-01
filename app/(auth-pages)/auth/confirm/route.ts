import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth/gotrue";
import { writeSessionCookies } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const tokenHash = searchParams.get("token_hash");
	const type = searchParams.get("type");
	const next = searchParams.get("next") ?? "/";

	if (tokenHash && type) {
		const result = await verifyToken(type, tokenHash);

		if (!result.ok) {
			if (result.code === "otp_expired") {
				redirect("/verify-email");
			}
			console.error("[auth/confirm] Error verifying auth token:", result.message);
			redirect("/error");
		}

		writeSessionCookies(await cookies(), result.data);

		if (type === "recovery" || type === "magiclink" || type === "email_change") {
			redirect(next);
		}

		if (type === "email") {
			redirect("/dashboard");
		}
	}

	redirect("/error");
}
