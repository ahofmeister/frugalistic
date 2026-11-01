import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const dataDir = process.env.DATA_DIR || "/data";
const secretsFile = `${dataDir}/secrets.json`;

mkdirSync(dataDir, { recursive: true });

if (!existsSync(secretsFile)) {
	writeFileSync(
		secretsFile,
		JSON.stringify({
			jwtSecret: randomBytes(32).toString("hex"),
			cronSecret: randomBytes(24).toString("hex"),
		}),
		{ mode: 0o600 },
	);
}

const secrets = JSON.parse(readFileSync(secretsFile, "utf8"));
const publicUrl = (process.env.PUBLIC_URL || "http://localhost:3000").replace(/\/$/, "");
const dbPassword = encodeURIComponent(process.env.POSTGRES_PASSWORD || "frugalistic");
const dbHost = process.env.POSTGRES_HOST || "db";
const smtpHost = process.env.SMTP_HOST || "";
const templates = "http://127.0.0.1:3000/email";

const appEnv = {
	...process.env,
	DATABASE_URL: `postgres://postgres:${dbPassword}@${dbHost}:5432/postgres`,
	JWT_SECRET: secrets.jwtSecret,
	CRON_SECRET: secrets.cronSecret,
	GOTRUE_URL: "http://127.0.0.1:9999",
	PUBLIC_URL: publicUrl,
	SELF_HOSTED: "true",
	PORT: "3000",
	HOSTNAME: "0.0.0.0",
};

const gotrueEnv = {
	PATH: process.env.PATH,
	API_EXTERNAL_URL: publicUrl,
	GOTRUE_API_HOST: "127.0.0.1",
	GOTRUE_API_PORT: "9999",
	GOTRUE_DB_DRIVER: "postgres",
	GOTRUE_DB_DATABASE_URL: `postgres://supabase_auth_admin:${dbPassword}@${dbHost}:5432/postgres`,
	GOTRUE_DB_MIGRATIONS_PATH: "/usr/local/etc/auth/migrations",
	GOTRUE_SITE_URL: publicUrl,
	GOTRUE_URI_ALLOW_LIST: `${publicUrl}/**`,
	GOTRUE_JWT_SECRET: secrets.jwtSecret,
	GOTRUE_JWT_EXP: "3600",
	GOTRUE_JWT_AUD: "authenticated",
	GOTRUE_EXTERNAL_EMAIL_ENABLED: "true",
	GOTRUE_DISABLE_SIGNUP: process.env.DISABLE_SIGNUP || "false",
	GOTRUE_MAILER_AUTOCONFIRM: smtpHost ? "false" : "true",
	GOTRUE_SMTP_HOST: smtpHost,
	GOTRUE_SMTP_PORT: process.env.SMTP_PORT || "587",
	GOTRUE_SMTP_USER: process.env.SMTP_USER || "",
	GOTRUE_SMTP_PASS: process.env.SMTP_PASS || "",
	GOTRUE_SMTP_ADMIN_EMAIL: process.env.SMTP_FROM || "noreply@localhost",
	GOTRUE_MAILER_TEMPLATES_CONFIRMATION: `${templates}/confirmation.html`,
	GOTRUE_MAILER_TEMPLATES_RECOVERY: `${templates}/recovery.html`,
	GOTRUE_MAILER_TEMPLATES_EMAIL_CHANGE: `${templates}/email-change.html`,
	GOTRUE_MAILER_SUBJECTS_CONFIRMATION: "Confirm your email",
	GOTRUE_MAILER_SUBJECTS_RECOVERY: "Reset your password",
	GOTRUE_MAILER_SUBJECTS_EMAIL_CHANGE: "Confirm your new email",
};

const children = [];
let stopping = false;

const shutdown = (code) => {
	if (stopping) {
		return;
	}
	stopping = true;
	for (const child of children) {
		child.kill("SIGTERM");
	}
	setTimeout(() => process.exit(code), 3000).unref();
};

const start = (command, args, options) => {
	const child = spawn(command, args, { stdio: "inherit", ...options });
	children.push(child);
	child.on("exit", (code) => shutdown(code ?? 1));
};

const migrate = () =>
	new Promise((resolve, reject) => {
		const child = spawn("node", ["scripts/migrate.mjs"], {
			cwd: "/opt/migrate",
			env: appEnv,
			stdio: "inherit",
		});
		child.on("exit", (code) =>
			code === 0 ? resolve() : reject(new Error(`migration failed with code ${code}`)),
		);
	});

process.on("SIGTERM", () => shutdown(0));
process.on("SIGINT", () => shutdown(0));

await migrate();

start("auth", [], { env: gotrueEnv });
start("node", ["server.js"], { cwd: "/app", env: appEnv });
