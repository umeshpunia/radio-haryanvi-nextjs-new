
import Link from 'next/link';
import { RssIcon, HomeIcon, SettingsIcon, HeartHandshakeIcon, CalendarClockIcon } from 'lucide-react';
import { ThemeToggleButton } from './theme-toggle-button';
import { Button } from '@/components/ui/button';

export function Header() {
  const navItems = [
    { href: '/', label: 'Home', icon: <HomeIcon className="h-5 w-5" /> },
    { href: '/donors', label: 'Donors', icon: <HeartHandshakeIcon className="h-5 w-5" /> },
    { href: '/programs', label: 'Programs', icon: <CalendarClockIcon className="h-5 w-5" /> },
    { href: '/blog', label: 'Blog', icon: <RssIcon className="h-5 w-5" /> },
    { href: '/settings', label: 'Settings', icon: <SettingsIcon className="h-5 w-5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 hidden w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block">
      <div className="container flex h-16 items-center justify-between">
        {/* Left Item: Brand */}
        <Link href="/" className="font-headline text-2xl font-bold text-primary">
          Radio Haryanvi
        </Link>

        {/* Center Item: Navigation */}
        {/* IMPORTANT: Ensure no whitespace between <Button asChild> and <Link> for each item */}
        <nav className="flex-grow flex justify-center items-center">
          {navItems.map((item) => (
            <Button key={item.href} variant="ghost" asChild className="mx-0.5"><Link href={item.href} className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary px-1.5 py-1">{item.icon}<span>{item.label}</span></Link></Button>
          ))}
        </nav>

        {/* Right Item: Theme Toggle */}
        <ThemeToggleButton />
      </div>
    </header>
  );
}
