
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, RssIcon, HeartHandshakeIcon, LayoutGridIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const moreScreenChildPaths = [
  '/settings',
  '/programs',
  '/artists',
  '/requests', // Added requests path
  '/about',
  '/contact',
  '/privacy',
  '/flappy-bird',
  '/device-info',
  // Add any other paths that should keep "More" active
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const navItems = [
    { href: '/', label: 'Home', icon: <HomeIcon className="h-6 w-6" /> },
    { href: '/donors', label: 'Donors', icon: <HeartHandshakeIcon className="h-6 w-6" /> },
    { href: '/blog', label: 'Blog', icon: <RssIcon className="h-6 w-6" /> },
    { href: '/more', label: 'More', icon: <LayoutGridIcon className="h-6 w-6" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-1 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex justify-around items-stretch h-full">
        {navItems.map((item) => {
          let isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          // Special handling for "More" tab and its child pages
          if (item.href === '/more') {
            isActive = pathname === '/more' || moreScreenChildPaths.some(childPath => pathname.startsWith(childPath));
          }
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center space-y-1 rounded-md p-2 transition-colors",
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
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
