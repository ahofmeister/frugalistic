"use client";

import React, { createContext, useContext } from "react";

import { Setting } from "@/types";

const SettingsContext = createContext<Setting | undefined>(undefined);

export function SettingsProvider({
  children,
  setting,
}: {
  children: React.ReactNode;
  setting: Setting;
}) {
  return (
    <SettingsContext.Provider value={setting}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSetting() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSetting must be used within a SettingProvider");
  }
  return context;
}
