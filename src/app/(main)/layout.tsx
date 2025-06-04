
import { Header } from "@/components/layout/header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { StickyAudioPlayer } from "@/components/audio-player/sticky-audio-player";
import { Footer } from "@/components/layout/footer";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col pb-[calc(9rem+env(safe-area-inset-bottom))] md:pb-[4.5rem]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
      <StickyAudioPlayer />
      <MobileBottomNav />
      {/* Spacers removed, padding is now on the parent div */}
    </div>
  );
}
