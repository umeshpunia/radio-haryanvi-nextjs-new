
"use client"; // Required to use useContext

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioIcon, RssIcon, VenetianMaskIcon, Music2Icon, HeartHandshakeIcon, InfoIcon } from 'lucide-react';
// import type { Metadata } from 'next'; // Metadata should be exported from server components or layout
import { CurrentProgramDisplay } from '@/components/programs/current-program-display';
import { useAppSettings } from '@/contexts/app-settings-context';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AdBanner } from '@/components/ads/ad-banner';

// If you need static metadata for this page, consider moving it to the (main)/layout.tsx
// or creating a parent server component that fetches and exports metadata.
// export const metadata: Metadata = { ... };

export default function HomePage() {
  const { showMessage, message, ads } = useAppSettings();

  return (
    <div className="flex flex-col items-center justify-center text-center">
      {showMessage && message && (
        <Alert className="mb-8 max-w-3xl mx-auto text-left shadow-lg">
          <InfoIcon className="h-5 w-5" />
          <AlertTitle>Important Update!</AlertTitle>
          <AlertDescription>
            {message}
          </AlertDescription>
        </Alert>
      )}

      <header className="mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary mb-4">
          Radio Haryanvi
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Immerse yourself in the vibrant sounds and rich cultural tapestry of Haryana with Radio Haryanvi. Tune into our 24/7 live Haryanvi radio stream, discover a wide array of traditional and contemporary Haryanvi songs, explore insightful articles on Haryanvi artists and culture through our blog, and connect with the heartland's rhythm. Radio Haryanvi is your ultimate Haryanvi music streaming destination and your premier source for everything Haryana radio.
        </p>
      </header>

      <div className="mb-16 relative w-full max-w-3xl aspect-video rounded-lg overflow-hidden shadow-2xl">
        <Image
          src="https://placehold.co/1200x675.png"
          alt="Vibrant Haryanvi cultural showcase with traditional music elements"
          layout="fill"
          objectFit="cover"
          priority
          data-ai-hint="Haryana culture festival music"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8">
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-white mb-2">Feel the Rhythm of Haryana</h2>
          <CurrentProgramDisplay />
        </div>
      </div>
      
      {ads && (
        <div className="my-8 w-full max-w-3xl">
          <AdBanner adSlot="YOUR_HOME_PAGE_AD_SLOT_ID" adFormat="auto" isResponsive={true} />
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-16">
        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-lg h-full">
          <RadioIcon className="w-16 h-16 text-primary mb-4" />
          <h3 className="font-headline text-2xl font-semibold mb-2 text-center">Live Radio</h3>
          <p className="text-muted-foreground text-center mb-4 flex-grow">
            Tune into our 24/7 live Haryanvi radio stream, featuring a diverse mix of classic Ragnis, folk songs, and the latest Haryanvi hits. Our Haryana radio broadcast brings you the authentic sounds of the heartland, non-stop.
          </p>
          <Button asChild>
            <Link href="/programs">View Programs</Link>
          </Button>
        </div>
        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-lg h-full">
          <RssIcon className="w-16 h-16 text-primary mb-4" />
          <h3 className="font-headline text-2xl font-semibold mb-2 text-center">Latest Blogs</h3>
          <p className="text-muted-foreground text-center mb-4 flex-grow">
            Explore in-depth articles, artist spotlights, and cultural insights on Haryanvi music, its history, and the vibrant traditions of Haryana. Our blog is your go-to source for news and stories about Haryanvi songs and culture.
          </p>
          <Button asChild>
            <Link href="/blog">Read Blog</Link>
          </Button>
        </div>
        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-lg h-full">
          <HeartHandshakeIcon className="w-16 h-16 text-primary mb-4" />
          <h3 className="font-headline text-2xl font-semibold mb-2 text-center">Blood Donation</h3>
          <p className="text-muted-foreground text-center mb-4 flex-grow">
            Join our community initiative. Find registered blood donors in Haryana or register yourself to help save lives. A vital service for our listeners, connecting those in need with willing donors across Haryana.
          </p>
          <Button asChild>
            <Link href="/donors">Visit Donors Page</Link>
          </Button>
        </div>
      </section>

      <section className="w-full max-w-4xl mb-16 p-8 bg-card rounded-lg shadow-lg text-left">
        <div className="flex items-start gap-6">
            <VenetianMaskIcon className="w-12 h-12 md:w-16 md:h-16 text-primary mt-1 flex-shrink-0" />
            <div>
                <h2 className="font-headline text-3xl font-semibold mb-3">Dive into Haryanvi Culture</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                Haryana, a land steeped in history and tradition, boasts a vibrant cultural tapestry. Radio Haryanvi invites you to explore this rich heritage, from the soul-stirring melodies of Haryanvi folk music like Ragni and Saang, and the energetic beats of its traditional dances, to the unique customs and dialects that define the region. Discover the fascinating stories, timeless rhythms, and enduring heritage that make Haryanvi culture so distinct and beloved. We delve into everything from traditional Haryanvi attire and local festivals to the nuances of Haryanvi language and poetry, offering a window into the heart of Haryana through our dedicated Haryana radio features.
                </p>
                <Button variant="link" asChild className="px-0 text-base">
                    <Link href="/blog?category=culture">Explore Haryanvi Heritage &rarr;</Link>
                </Button>
            </div>
        </div>
      </section>

      <section className="w-full max-w-4xl text-left p-8 bg-card rounded-lg shadow-lg mb-16">
         <div className="flex items-start gap-6">
            <Music2Icon className="w-12 h-12 md:w-16 md:h-16 text-primary mt-1 flex-shrink-0" />
            <div>
                <h2 className="font-headline text-3xl font-semibold mb-3">Your Home for Haryanvi Music</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                Radio Haryanvi is passionately dedicated to preserving, promoting, and celebrating the rich musical heritage of Haryana. We strive to be the premier global platform for Haryanvi music enthusiasts, offering an authentic and immersive listening experience for all types of Haryanvi songs – from classic folk to modern hits. Through our live Haryanvi radio, comprehensive Haryanvi blog, and features on local artists, we connect you to the diverse talents and cultural expressions from the heartland of Haryana. Join our growing community, tune into the best Haryanvi music streaming service, and celebrate the indomitable spirit of Haryanvi culture with us! Radio Haryanvi is more than just Haryana radio; it's a cultural movement.
                </p>
                 <Button asChild size="lg">
                    <Link href="/about">Learn More About Us</Link>
                </Button>
            </div>
        </div>
      </section>
    </div>
  );
}

