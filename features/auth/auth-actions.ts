"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import {
	getUser,
	signOut as gotrueSignOut,
	signUp as gotrueSignUp,
	recover,
	signInWithPassword,
	updateUser,
} from "@/lib/auth/gotrue";
import { ACCESS_COOKIE, clearSessionCookies, writeSessionCookies } from "@/lib/auth/session";
import { encodedRedirect } from "@/lib/utils";

export const signOut = async () => {
	const store = await cookies();
	const accessToken = store.get(ACCESS_COOKIE)?.value;
	if (accessToken) {
		await gotrueSignOut(accessToken);
	}
	clearSessionCookies(store);
	redirect("/login");
};

export async function signIn(formData: FormData) {
	const result = await signInWithPassword(
		String(formData.get("email")),
		String(formData.get("password")),
	);

	if (!result.ok) {
		return { success: false as const, code: result.code ?? "invalid_credentials" };
	}

	writeSessionCookies(await cookies(), result.data);
	redirect("/dashboard");
}

export const signUp = async (formData: FormData) => {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	const result = await gotrueSignUp(email, password);

	if (!result.ok) {
		console.error(result.message);
		return redirect("/login?message=Could not authenticate user");
	}

	if (result.data.access_token && result.data.refresh_token) {
		writeSessionCookies(await cookies(), {
			access_token: result.data.access_token,
			refresh_token: result.data.refresh_token,
			expires_in: result.data.expires_in ?? 3600,
		});
		return redirect("/dashboard");
	}

	return redirect("/login?message=Check email to continue sign in process");
};

export const getCurrentUser = cache(async () => {
	const store = await cookies();
	const accessToken = store.get(ACCESS_COOKIE)?.value;
	if (!accessToken) {
		return null;
	}
	const result = await getUser(accessToken);
	return result.ok ? result.data : null;
});

export type PasswordUpdateActionResponse = {
	success: boolean;
	code?: string;
	email?: string;
};

export const forgotPasswordAction = async (
	_: PasswordUpdateActionResponse | null,
	formData: FormData,
): Promise<PasswordUpdateActionResponse> => {
	const email = formData.get("email")?.toString().trim();

	if (!email) {
		return encodedRedirect("error", "/forgot-password", "Email is required");
	}

	const result = await recover(email);

	if (!result.ok) {
		console.error(result.message);
		return {
			success: false,
			code: "error",
			email,
		};
	}

	return {
		success: true,
		code: "success",
	};
};

export type AuthActionResponse = {
	success: boolean;
	code?: string;
	inputs?: {
		email?: string;
	};
};

export async function resetPasswordAction(
	_: AuthActionResponse | null,
	passwordData: FormData,
): Promise<AuthActionResponse> {
	if (
		(passwordData.get("newPassword") as string) !==
		(passwordData.get("passwordConfirmation") as string)
	) {
		return { success: false, code: "passwordNotMatch" };
	}

	const store = await cookies();
	const accessToken = store.get(ACCESS_COOKIE)?.value ?? "";

	const result = await updateUser(accessToken, {
		password: passwordData.get("newPassword") as string,
	});

	if (!result.ok) {
		console.error("Error resetting password:", result.message);

		if (result.code === "same_password") {
			return { success: false, code: "samePassword" };
		}

		return { success: false, code: "general" };
	}

	return { success: true, code: "general" };
}
