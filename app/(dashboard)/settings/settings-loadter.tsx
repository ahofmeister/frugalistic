import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import SettingsProvider from "@/app/(dashboard)/settings/settings-provider";

export default function SettingsLoader({ children }: { children: React.ReactNode }) {
	const settingsPromise = getSettings();

	return <SettingsProvider settingsPromise={settingsPromise}>{children}</SettingsProvider>;
}
