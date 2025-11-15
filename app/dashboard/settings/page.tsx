import React, { Suspense } from "react";
import { SettingsForm } from "@/app/dashboard/settings/settingsForm";
import { getSettings } from "@/app/dashboard/settings/settings-actions";

async function DateFormatSetting() {
  const settings = await getSettings();

  return (
    <SettingsForm
      initialDateFormat={settings.date_format}
      settingsId={settings.id}
    />
  );
}

export default async function SettingsPage() {
  return (
    <div className="space-y-2 max-w-md">
      <label className="text-sm font-medium">Date Format</label>
      <Suspense>
        <DateFormatSetting />
      </Suspense>
    </div>
  );
}
