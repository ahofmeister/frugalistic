"use client";
import { format } from "date-fns";
import { updateSettings } from "@/app/(dashboard)/settings/settings-actions";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useTransition } from "react";
import LoadingSpinner from "@/components/loading/loading";

export function SettingsForm({
  initialDateFormat,
  settingsId,
}: {
  initialDateFormat: string;
  settingsId: string;
}) {
  const [dateFormat, setDateFormat] = useState(initialDateFormat);
  const [isPending, startTransition] = useTransition();

  const getError = (fmt: string) => {
    if (!fmt) {
      return "Required";
    }
    if (fmt.length > 20) {
      return "Must be 20 characters or less";
    }
    try {
      format(new Date(), fmt);
      return null;
    } catch {
      return "Invalid format";
    }
  };

  useEffect(() => {
    const error = getError(dateFormat);
    const shouldSave = !error && dateFormat !== initialDateFormat;
    if (!shouldSave) {
      return;
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        await updateSettings({ date_format: dateFormat, id: settingsId });
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [dateFormat, settingsId, initialDateFormat]);

  const error = getError(dateFormat);
  const preview = error ? null : `Preview: ${format(new Date(), dateFormat)}`;

  return (
    <>
      <div className="relative">
        <Input
          value={dateFormat}
          onChange={(e) => setDateFormat(e.target.value)}
          placeholder="yyyy-MM-dd"
          className="pr-20"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isPending && <LoadingSpinner />}
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        {error && <span className="text-destructive">{error}</span>}
        {preview && preview}
      </div>
    </>
  );
}
