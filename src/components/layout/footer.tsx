
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: <Facebook className="h-5 w-5" /> },
    { name: 'Twitter', href: '#', icon: <Twitter className="h-5 w-5" /> },
    { name: 'Instagram', href: '#', icon: <Instagram className="h-5 w-5" /> },
    { name: 'YouTube', href: '#', icon: <Youtube className="h-5 w-5" /> },
  ];

  const internalLinks = [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/donors", label: "Donors" },
  ];

  return (
    <footer className="border-t bg-card text-card-foreground mt-auto">
      <div className="container mx-auto px-4 py-10 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Copyright */}
          <div className="text-left">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear !== null ? currentYear : '...'} Radio Haryanvi.
            </p>
            <p className="text-xs text-muted-foreground">
              All Rights Reserved.
            </p>
          </div>

          {/* Internal Links */}
          <div className="flex flex-col items-start gap-2">
            <h3 className="font-semibold text-primary mb-2 text-base">Quick Links</h3>
            {internalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                prefetch={false}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col items-start md:items-end gap-2"> {/* Changed alignment here */}
             <h3 className="font-semibold text-primary mb-2 text-base">Connect With Us</h3>
            <div className="flex space-x-4">
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
        </div>
        <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-xs text-muted-foreground">
                Radio Haryanvi - Your sound, your culture.
            </p>
        </div>
      </div>
    </footer>
  );
}
