
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const topNavLinks = [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/donors", label: "Donors" },
    { href: "/artists", label: "Artists" }, // Added Artists link
  ];

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: <Facebook className="h-6 w-6" /> },
    { name: 'Twitter', href: '#', icon: <Twitter className="h-6 w-6" /> },
    { name: 'Instagram', href: '#', icon: <Instagram className="h-6 w-6" /> },
    { name: 'YouTube', href: '#', icon: <Youtube className="h-6 w-6" /> },
  ];

  return (
    <footer className="hidden md:flex md:flex-col border-t bg-card text-card-foreground mt-auto">
      <div className="container mx-auto px-4 py-8 md:px-6">
        {/* Top Links Row */}
        <nav className="flex justify-center space-x-6 mb-8">
          {topNavLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Brand, Tagline, and Social Icons */}
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <Link href="/" className="font-headline text-3xl font-bold text-primary">
            Radio Haryanvi
          </Link>
          <p className="text-base text-muted-foreground">
            Your sound, your culture.
          </p>
          <div className="flex space-x-5">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Separator and Copyright */}
        <div className="border-t border-border/50 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear !== null ? currentYear : '...'} Radio Haryanvi. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
