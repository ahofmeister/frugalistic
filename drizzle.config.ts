import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	throw new Error("DATABASE_URL environment variable is required");
}

export default defineConfig({
	schema: "./db/migrations/schema.ts",
	out: "./db//migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: databaseUrl,
		ssl: true,
	},
	schemaFilter: ["auth"],
});
