import { Header } from "@/components/layout/header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { StickyAudioPlayer } from "@/components/audio-player/sticky-audio-player";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <StickyAudioPlayer />
      <MobileBottomNav />
      {/* Add a spacer div to prevent content from being hidden behind the fixed player and nav on mobile */}
      <div className="h-[calc(4.5rem+env(safe-area-inset-bottom))] md:h-0"></div> {/* Mobile nav height */}
      <div className="h-[calc(5rem)] md:h-0"></div> {/* Player height, adjust if needed */}
    </div>
  );
}
