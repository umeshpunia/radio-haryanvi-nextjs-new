
"use client";

import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileSubPageHeaderProps {
  title: string;
  actionButton?: React.ReactNode; // New prop
}

export function MobileSubPageHeader({ title, actionButton }: MobileSubPageHeaderProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back" className="shrink-0">
        <ChevronLeftIcon className="h-6 w-6" />
      </Button>
      <h1 className="flex-grow truncate px-2 text-center text-lg font-semibold text-foreground">
        {title}
      </h1>
      {actionButton ? (
        <div className="shrink-0">{actionButton}</div>
      ) : (
        <div className="w-10 shrink-0"></div> // Spacer to balance the back button
      )}
    </div>
  );
}
