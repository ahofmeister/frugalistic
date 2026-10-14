"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { encodedRedirect } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";

export const signOut = async () => {
	const supabase = await createClient();
	await supabase.auth.signOut();
	redirect("/login");
};

export async function signIn(formData: FormData) {
	const supabase = await createClient();
	const { error } = await supabase.auth.signInWithPassword({
		email: String(formData.get("email")),
		password: String(formData.get("password")),
	});

	if (error) {
		return { success: false as const, code: error.code ?? "invalid_credentials" };
	}

	redirect("/dashboard");
}

export const signUp = async (formData: FormData) => {
	const origin = (await headers()).get("origin");
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const supabase = await createClient();

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${origin}/auth/callback`,
		},
	});

	if (error) {
		console.error(error);
		return redirect("/login?message=Could not authenticate user");
	}

	return redirect("/login?message=Check email to continue sign in process");
};

export const getCurrentUser = async () => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user;
};

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
	const supabase = await createClient();
	const origin = (await headers()).get("origin");

	if (!email) {
		return encodedRedirect("error", "/forgot-password", "Email is required");
	}

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
	});

	if (error) {
		console.error(JSON.stringify(error, undefined, 2));
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
	const supabase = await createClient();
	if (
		(passwordData.get("newPassword") as string) !==
		(passwordData.get("passwordConfirmation") as string)
	) {
		return { success: false, code: "passwordNotMatch" };
	}

	const { error } = await supabase.auth.updateUser({
		password: passwordData.get("newPassword") as string,
	});

	if (error) {
		console.error("Error resetting password:", error);

		if (error.code === "same_password") {
			return { success: false, code: "samePassword" };
		}

		return { success: false, code: "general" };
	}

	return { success: true, code: "general" };
}
