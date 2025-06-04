
import Link from 'next/link';
import { RssIcon, HomeIcon, SettingsIcon, HeartHandshakeIcon } from 'lucide-react'; // Added SettingsIcon, HeartHandshakeIcon
import { ThemeToggleButton } from './theme-toggle-button';
import { Button } from '@/components/ui/button';

export function Header() {
  const navItems = [
    { href: '/', label: 'Home', icon: <HomeIcon className="h-5 w-5" /> },
    { href: '/donors', label: 'Donors', icon: <HeartHandshakeIcon className="h-5 w-5" /> },
    { href: '/blog', label: 'Blog', icon: <RssIcon className="h-5 w-5" /> },
    { href: '/settings', label: 'Settings', icon: <SettingsIcon className="h-5 w-5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 hidden w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-headline text-2xl font-bold text-primary">
          Radio Haryanvi
        </Link>
        <nav className="flex items-center space-x-6 lg:space-x-8">
          {navItems.map((item) => (
            <Button key={item.href} variant="ghost" asChild>
              <Link href={item.href} className="flex items-center gap-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </Button>
          ))}
        </nav>
        <ThemeToggleButton />
      </div>
    </header>
  );
}
