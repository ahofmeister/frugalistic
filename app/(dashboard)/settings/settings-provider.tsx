"use client";

import type React from "react";
import { createContext, use, useContext } from "react";

type Settings = {
	dateFormat: string;
	transactionDisplayAmount: string;
};

const SettingsContext = createContext<Settings | null>(null);

export default function SettingsProvider({
	settingsPromise,
	children,
}: {
	settingsPromise: Promise<Settings>;
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
