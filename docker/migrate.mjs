import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const url = process.env.DATABASE_URL;

if (!url) {
	throw new Error("DATABASE_URL is not set");
}

const client = postgres(url, { max: 1, onnotice: () => {} });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

for (let attempt = 1; attempt <= 60; attempt++) {
	try {
		await client`select 1`;
		break;
	} catch (error) {
		if (attempt === 60) {
			throw error;
		}
		await sleep(2000);
	}
}

await migrate(drizzle({ client }), { migrationsFolder: "./drizzle/migrations" });
await client.end();
console.log("Migrations applied");
