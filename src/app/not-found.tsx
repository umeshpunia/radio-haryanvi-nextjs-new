
import { Header } from "@/components/layout/header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { StickyAudioPlayer } from "@/components/audio-player/sticky-audio-player";
import { Footer } from "@/components/layout/footer";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, HomeIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col pb-[calc(9rem+env(safe-area-inset-bottom))] md:pb-[4.5rem]">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-md text-center motion-safe:animate-fadeInUp">
          <AlertTriangle className="mx-auto h-24 w-24 text-destructive animate-pulse" />
          <h1 className="mt-8 text-4xl font-bold tracking-tight text-primary sm:text-5xl font-headline">
            Page Not Found
          </h1>
          <p className="mt-6 text-base leading-7 text-muted-foreground">
            Oops! The page you&apos;re looking for doesn&apos;t seem to exist.
            It might have been moved, deleted, or perhaps you just mistyped the URL.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/">
                <HomeIcon className="mr-2 h-5 w-5" />
                Go Back Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
      <StickyAudioPlayer />
      <MobileBottomNav />
    </div>
  );
}
