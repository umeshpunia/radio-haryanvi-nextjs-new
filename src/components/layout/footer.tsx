"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row md:px-6">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear !== null ? currentYear : '...'} Radio Haryanvi. All Rights Reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            prefetch={false}
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            prefetch={false}
          >
            Contact
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            prefetch={false}
          >
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
