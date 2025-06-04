import Link from 'next/link';
import { RadioIcon, RssIcon, HomeIcon } from 'lucide-react';
import { ThemeToggleButton } from './theme-toggle-button';
import { Button } from '@/components/ui/button';

export function Header() {
  const navItems = [
    { href: '/', label: 'Home', icon: <HomeIcon className="h-5 w-5" /> },
    { href: '/radio', label: 'Radio', icon: <RadioIcon className="h-5 w-5" /> },
    { href: '/blog', label: 'Blog', icon: <RssIcon className="h-5 w-5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 hidden w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-headline text-2xl font-bold text-primary">
          Haryanvi Radio Hub
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6">
          {navItems.map((item) => (
            <Button key={item.href} variant="ghost" asChild>
              <Link href={item.href} className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
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
