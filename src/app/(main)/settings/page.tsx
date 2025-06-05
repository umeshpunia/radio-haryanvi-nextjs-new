
import { Metadata } from 'next';
import { SettingsIcon } from 'lucide-react';
import { ThemeToggleButton } from '@/components/layout/theme-toggle-button';
import { MobileSubPageHeader } from '@/components/layout/mobile-subpage-header';

export const metadata: Metadata = {
  title: 'Settings - Radio Haryanvi',
  description: 'Manage your application settings.',
};

export default function SettingsPage() {
  return (
    <>
      <MobileSubPageHeader title="App Settings" />
      <div className="flex flex-col items-center text-center">
        <SettingsIcon className="w-24 h-24 text-primary mb-6 mt-8 md:mt-0" /> {/* Added mt-8 for mobile spacing */}
        <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">
          App Settings
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl">
          Manage your application preferences here.
        </p>
        <div className="p-8 bg-card rounded-lg shadow-md w-full max-w-md">
          <h2 className="font-headline text-2xl font-semibold mb-3">Theme Configuration</h2>
          <p className="text-muted-foreground mb-4">
            Choose your preferred application theme.
          </p>
          <ThemeToggleButton />
        </div>
      </div>
    </>
  );
}
