
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioIcon, RssIcon, HeadphonesIcon, UsersIcon, VenetianMaskIcon, Music2Icon } from 'lucide-react';
import type { Metadata } from 'next';
import { CurrentProgramDisplay } from '@/components/programs/current-program-display'; // Import the new component

export const metadata: Metadata = {
  title: 'Radio Haryanvi | Live Haryanvi Music, Songs & Haryana Culture',
  description: 'Tune into Radio Haryanvi 24/7 for live Haryanvi music, discover new Haryanvi songs and artists, and explore the rich culture of Haryana. Your number one source for Haryanvi entertainment and Haryana radio.',
  keywords: ['radio haryanvi', 'haryanvi', 'haryana', 'radio haryana', 'haryanvi music', 'live haryanvi radio', 'haryanvi songs', 'haryanvi culture', 'haryanvi folk music', 'haryanvi artists', 'best haryanvi music streaming', 'haryanvi top charts', 'latest haryanvi tracks', 'haryanvi singers', 'haryanvi ragni', 'haryanvi saang', 'haryanvi programs'],
  openGraph: {
    title: 'Radio Haryanvi | Live Haryanvi Music & Culture',
    description: 'Your ultimate destination for authentic Haryanvi music, live radio, and cultural insights from Haryana.',
    images: [
      {
        url: '/og-image-home.png', 
        width: 1200,
        height: 630,
        alt: 'Radio Haryanvi - Live Haryanvi Music Stream & Culture Hub',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Radio Haryanvi | Stream Live Haryanvi Music & Explore Culture',
    description: 'Listen to the best Haryanvi songs, discover artists, and dive into Haryana culture with Radio Haryanvi.',
    images: ['/twitter-image-home.png'], 
  },
};

export default function HomePage() {
  const featuredArtists = [
    {
      name: "Sapna Choudhary",
      genre: "Folk Dance & Music",
      imageUrl: "https://placehold.co/300x300.png",
      aiHint: "female dancer"
    },
    {
      name: "Gulzaar Chhaniwala",
      genre: "Modern Haryanvi Pop",
      imageUrl: "https://placehold.co/300x300.png",
      aiHint: "male singer"
    },
    {
      name: "Renuka Panwar",
      genre: "Popular Haryanvi Hits",
      imageUrl: "https://placehold.co/300x300.png",
      aiHint: "female singer"
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <header className="mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary mb-4">
          Radio Haryanvi
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Immerse yourself in the vibrant sounds and culture of Haryana. Tune into live Haryanvi radio, discover new artists, and read our latest blog posts. Your ultimate Haryanvi music streaming destination.
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
          {/* Display current program here */}
          <CurrentProgramDisplay />
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-16">
        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-lg">
          <RadioIcon className="w-16 h-16 text-primary mb-4" />
          <h3 className="font-headline text-2xl font-semibold mb-2">Live Radio</h3>
          <p className="text-muted-foreground text-center mb-4">
            Tune into our 24/7 Haryanvi music stream.
          </p>
          <Button asChild>
            <Link href="/radio">Listen Now</Link>
          </Button>
        </div>
        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-lg">
          <RssIcon className="w-16 h-16 text-primary mb-4" />
          <h3 className="font-headline text-2xl font-semibold mb-2">Latest Blogs</h3>
          <p className="text-muted-foreground text-center mb-4">
            Explore articles on Haryanvi music, artists, and culture.
          </p>
          <Button asChild>
            <Link href="/blog">Read Blog</Link>
          </Button>
        </div>
        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-lg">
          <HeadphonesIcon className="w-16 h-16 text-primary mb-4" />
          <h3 className="font-headline text-2xl font-semibold mb-2">Discover Music</h3>
          <p className="text-muted-foreground text-center mb-4">
            Find new Haryanvi tracks and support local artists.
          </p>
          <Button variant="outline">Explore Artists</Button>
        </div>
      </section>

      <section className="w-full max-w-5xl mb-16">
        <div className="text-center mb-10">
            <UsersIcon className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-2">
                Spotlight on Haryanvi Artists
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover the voices and talents shaping the Haryanvi music scene.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArtists.map((artist) => (
            <Card key={artist.name} className="flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary/50">
                  <Image 
                    src={artist.imageUrl} 
                    alt={`Portrait of ${artist.name}, Haryanvi artist`} 
                    layout="fill" 
                    objectFit="cover"
                    data-ai-hint={artist.aiHint} 
                  />
                </div>
                <CardTitle className="font-headline text-xl md:text-2xl">{artist.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{artist.genre}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="w-full max-w-4xl mb-16 p-8 bg-card rounded-lg shadow-lg text-left">
        <div className="flex items-start gap-4">
            <VenetianMaskIcon className="w-12 h-12 text-primary mt-1 flex-shrink-0" />
            <div>
                <h2 className="font-headline text-3xl font-semibold mb-3">Dive into Haryanvi Culture</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                Haryana, a land rich in tradition, boasts a vibrant cultural tapestry woven with captivating folk music like Ragni and Saang, energetic dances, and unique customs. Explore the stories, rhythms, and heritage that make Haryanvi culture so distinct and beloved. From traditional attire to local festivals, there's a wealth of Haryanvi heritage to discover.
                </p>
                <Button variant="link" asChild className="px-0">
                    <Link href="/blog?category=culture">Explore Haryanvi Heritage &rarr;</Link>
                </Button>
            </div>
        </div>
      </section>
      
      <section className="w-full max-w-4xl text-left p-8 bg-accent/30 rounded-lg shadow-lg border border-primary/30">
         <div className="flex items-start gap-4">
            <Music2Icon className="w-12 h-12 text-primary mt-1 flex-shrink-0" />
            <div>
                <h2 className="font-headline text-3xl font-semibold mb-3">Your Home for Haryanvi Music</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                Radio Haryanvi is dedicated to promoting the rich musical heritage of Haryana. We strive to be the premier platform for Haryanvi music lovers worldwide, offering a seamless listening experience for Haryanvi songs, insightful articles through our Haryanvi blog, and a space to discover the diverse talents from the heartland of Haryana. Join our community and celebrate the spirit of Haryanvi culture with us! Find the best Haryanvi music streaming here.
                </p>
                 <Button asChild>
                    <Link href="/about">Learn More About Us</Link>
                </Button>
            </div>
        </div>
      </section>
    </div>
  );
}
