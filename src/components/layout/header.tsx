
import Link from 'next/link';
import { ThemeToggleButton } from './theme-toggle-button';
import { Button } from '@/components/ui/button';

export function Header() {
  const navItems = [
    { href: '/', label: 'Home'},
    { href: '/blog', label: 'Blog'},
    { href: '/about', label: 'About Us'},
    { href: '/contact', label: 'Contact Us'},
    { href: '/privacy', label: 'Privacy Policy'},
  ];

  return (
    <header className="sticky top-0 z-50 hidden w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-headline text-2xl font-bold text-primary">
          Radio Haryanvi
        </Link>
        <nav className="flex-grow flex justify-center items-center">
          {navItems.map((item) => (
            <Button key={item.href} variant="ghost" asChild className="mx-0.5">
              <Link href={item.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary px-3 py-1.5">
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
