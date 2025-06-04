
import Link from 'next/link';
import { RssIcon, HomeIcon, SettingsIcon, HeartHandshakeIcon, CalendarClockIcon } from 'lucide-react';
import { ThemeToggleButton } from './theme-toggle-button';
import { Button } from '@/components/ui/button';

export function Header() {
  const navItems = [
    { href: '/', label: 'Home', icon: <HomeIcon /> },
    { href: '/donors', label: 'Donors', icon: <HeartHandshakeIcon /> }, 
    { href: '/programs', label: 'Programs', icon: <CalendarClockIcon /> },
    { href: '/blog', label: 'Blog', icon: <RssIcon /> },
    { href: '/settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  return (
    <header className="sticky top-0 z-50 hidden w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-headline text-2xl font-bold text-primary">
          Radio Haryanvi
        </Link>
        <nav className="flex-grow flex justify-center items-center">
          {navItems.map((item) => (
            <Button key={item.href} variant="ghost" asChild className="mx-0.5"><Link href={item.href} className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary px-1.5 py-1"><span className="h-5 w-5 flex items-center justify-center">{item.icon}</span><span>{item.label}</span></Link></Button>
          ))}
        </nav>
        <ThemeToggleButton />
      </div>
    </header>
  );
}
