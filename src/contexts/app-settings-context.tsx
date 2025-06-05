
"use client";

import type { AppDetails } from '@/types/app-details';
import React, { createContext, useContext, ReactNode } from 'react';

interface AppSettingsContextType extends Omit<AppDetails, 'id' | 'version'> {}

const defaultAppSettings: AppSettingsContextType = {
  ads: false,
  message: '',
  showMessage: false,
};

const AppSettingsContext = createContext<AppSettingsContextType>(defaultAppSettings);

export const useAppSettings = () => useContext(AppSettingsContext);

interface AppSettingsProviderProps {
  children: ReactNode;
  settings: AppSettingsContextType | null;
}

export function AppSettingsProvider({ children, settings }: AppSettingsProviderProps) {
  const value = settings || defaultAppSettings;
  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}
