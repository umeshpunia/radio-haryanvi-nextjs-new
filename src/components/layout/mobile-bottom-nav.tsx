"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, RadioIcon, RssIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const pathname = usePathname();
  const navItems = [
    { href: '/', label: 'Home', icon: <HomeIcon className="h-6 w-6" /> },
    { href: '/radio', label: 'Radio', icon: <RadioIcon className="h-6 w-6" /> },
    { href: '/blog', label: 'Blog', icon: <RssIcon className="h-6 w-6" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-2 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center space-y-1 rounded-md p-2 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
