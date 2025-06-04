import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RadioIcon, RssIcon, HeadphonesIcon } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <header className="mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary mb-4">
          Radio Haryanvi
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Immerse yourself in the vibrant sounds and culture of Haryana. Tune into live radio, discover new artists, and read our latest blog posts.
        </p>
      </header>

      <div className="mb-12 relative w-full max-w-3xl aspect-video rounded-lg overflow-hidden shadow-2xl">
        <Image 
          src="https://placehold.co/1200x675.png" 
          alt="Haryanvi Culture Showcase" 
          layout="fill" 
          objectFit="cover"
          priority
          data-ai-hint="Haryana culture music"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8">
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-white mb-2">Feel the Rhythm of Haryana</h2>
          <p className="text-base md:text-lg text-gray-200">Live Radio Streaming Now!</p>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-12">
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

      <section className="w-full max-w-4xl text-left p-8 bg-card rounded-lg shadow-lg">
        <h2 className="font-headline text-3xl font-semibold mb-4">About Us</h2>
        <p className="text-muted-foreground leading-relaxed">
          Radio Haryanvi is dedicated to promoting the rich musical heritage of Haryana. We strive to be the premier platform for Haryanvi music lovers worldwide, offering a seamless listening experience, insightful articles, and a space to discover the diverse talents from the heartland of Haryana. Join our community and celebrate the spirit of Haryanvi culture with us!
        </p>
      </section>
    </div>
  );
}
