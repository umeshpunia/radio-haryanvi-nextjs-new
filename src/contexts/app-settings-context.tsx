"use client";

import { getAppDetails } from "@/services/app-details-service";
import type { AppDetails } from "@/types/app-details";
import React, { createContext, useContext, ReactNode } from "react";

interface AppSettingsContextType extends Omit<AppDetails, "id" | "version"> {
  streamingUrl?: string;
  metaDataUrl?: string;
  bannerImage?: string;
  bannerTopText?: string;
  bannerTextBottom?: string;
}

const defaultAppSettings: AppSettingsContextType = {
  ads: false,
  message: "",
  showMessage: false,
  streamingUrl: "https://listen.weareharyanvi.com/listen", // Default fallback
  metaDataUrl: "https://listen.weareharyanvi.com/status-json.xsl", // Default fallback
  bannerImage: "/images/radio-haryanvi-banner.png",
  bannerTopText: "",
  bannerTextBottom: "",
};

const AppSettingsContext =
  createContext<AppSettingsContextType>(defaultAppSettings);

export const useAppSettings = () => useContext(AppSettingsContext);

interface AppSettingsProviderProps {
  children: ReactNode;
  settings: AppSettingsContextType | null; // Settings can be null if initial fetch fails or is pending
}

export function AppSettingsProvider({
  children,
  settings,
}: AppSettingsProviderProps) {
  // Use fetched settings if available, otherwise merge with defaults to ensure all keys are present
  const value = settings
    ? { ...defaultAppSettings, ...settings }
    : defaultAppSettings;

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}
