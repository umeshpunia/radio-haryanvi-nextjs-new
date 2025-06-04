import { Metadata } from 'next';
import { SettingsIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Settings - Haryanvi Radio Hub',
  description: 'Manage your application settings.',
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center">
        <SettingsIcon className="w-24 h-24 text-primary mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">
          App Settings
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl">
          This is the settings page. You can manage your preferences here.
        </p>
        <div className="p-8 bg-card rounded-lg shadow-md w-full max-w-md">
          <h2 className="font-headline text-2xl font-semibold mb-3">Configuration Options</h2>
          <p className="text-muted-foreground">
            Settings content will go here.
          </p>
        </div>
      </div>
    </div>
  );
}
