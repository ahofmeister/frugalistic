"use client";

import type React from "react";
import { createContext, use, useContext } from "react";
import type { settingSchema } from "@/drizzle/schema";

const SettingsContext = createContext<typeof settingSchema.$inferSelect | null>(null);

export default function SettingsProvider({
	settingsPromise,
	children,
}: {
	settingsPromise: Promise<typeof settingSchema.$inferSelect>;
	children: React.ReactNode;
}) {
	const settings = use(settingsPromise);

	return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
	const context = useContext(SettingsContext);

	if (!context) {
		throw new Error("useSettings must be used within SettingsProvider");
	}

	return context;
}
