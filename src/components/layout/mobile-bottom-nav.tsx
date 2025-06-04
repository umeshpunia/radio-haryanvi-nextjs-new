
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, RssIcon, HeartHandshakeIcon, LayoutGridIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const pathname = usePathname();
  const navItems = [
    { href: '/', label: 'Home', icon: <HomeIcon className="h-6 w-6" /> },
    { href: '/donors', label: 'Donors', icon: <HeartHandshakeIcon className="h-6 w-6" /> },
    { href: '/blog', label: 'Blog', icon: <RssIcon className="h-6 w-6" /> },
    { href: '/more', label: 'More', icon: <LayoutGridIcon className="h-6 w-6" /> },
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
                "flex flex-col items-center space-y-1 rounded-md p-2 transition-colors w-[24%]", // Adjusted width for 4 items
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              {item.icon}
              <span className="text-xs text-center break-words">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
