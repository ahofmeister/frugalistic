const baseUrl = process.env.GOTRUE_URL ?? "http://localhost:9999";

export type GoTrueSession = {
	access_token: string;
	refresh_token: string;
	expires_in: number;
};

export type GoTrueUser = {
	id: string;
	email: string | null;
	phone: string | null;
	created_at: string;
	updated_at: string;
	last_sign_in_at: string | null;
	email_confirmed_at: string | null;
	user_metadata: Record<string, unknown>;
	app_metadata: Record<string, unknown>;
};

const apiKey = process.env.GOTRUE_API_KEY;

export type GoTrueResult<T> = { ok: true; data: T } | { ok: false; message: string; code?: string };

type GoTrueMethod = "POST" | "PUT" | "GET";

async function call<T>(
	path: string,
	body: unknown,
	token?: string,
	method: GoTrueMethod = "POST",
): Promise<GoTrueResult<T>> {
	const response = await fetch(`${baseUrl}${path}`, {
		method,
		cache: "no-store",
		headers: {
			"Content-Type": "application/json",
			...(apiKey ? { apikey: apiKey } : {}),
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		body: method === "GET" ? undefined : JSON.stringify(body),
	});
	const text = await response.text();
	let json: Record<string, string>;
	try {
		json = JSON.parse(text);
	} catch {
		json = {};
	}

	if (!response.ok) {
		console.error("GoTrue error:", {
			url: `${baseUrl}${path}`,
			status: response.status,
			body: text.slice(0, 300),
		});
		return {
			ok: false,
			message: json.msg ?? json.message ?? json.error_description ?? "Request failed",
			code: json.error_code ?? undefined,
		};
	}

	return { ok: true, data: json as T };
}

export const signInWithPassword = (email: string, password: string) =>
	call<GoTrueSession>("/token?grant_type=password", { email, password });

export const refreshSession = (refreshToken: string) =>
	call<GoTrueSession>("/token?grant_type=refresh_token", { refresh_token: refreshToken });

export const signUp = (email: string, password: string) =>
	call<Partial<GoTrueSession>>("/signup", { email, password });

export const recover = (email: string, redirectTo?: string) =>
	call<object>(redirectTo ? `/recover?redirect_to=${encodeURIComponent(redirectTo)}` : "/recover", {
		email,
	});

export const verifyToken = (type: string, tokenHash: string) =>
	call<GoTrueSession>("/verify", { type, token_hash: tokenHash });

export const signOut = (accessToken: string) => call<object>("/logout", {}, accessToken);

export const getUser = (accessToken: string) =>
	call<GoTrueUser>("/user", undefined, accessToken, "GET");

export const updateUser = (
	accessToken: string,
	attributes: { email?: string; password?: string; data?: Record<string, unknown> },
) => call<{ id: string; email: string }>("/user", attributes, accessToken, "PUT");
