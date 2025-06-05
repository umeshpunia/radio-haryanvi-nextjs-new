
import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/wordpress';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';

interface ArtistCardProps {
  artist: Post; // Using Post type, assuming artists are posts
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const featuredImageUrl = artist._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://placehold.co/400x400.png`;
  
  // Artists are often linked via their main blog post slug
  const artistLink = `/blog/${artist.slug}`; 

  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Link href={artistLink} aria-label={artist.title.rendered}>
          <div className="relative w-full aspect-square">
            <Image
              src={featuredImageUrl}
              alt={artist.title.rendered}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="artist portrait music"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4 text-center">
        <Link href={artistLink}>
          <CardTitle className="font-headline text-xl md:text-2xl mb-2 line-clamp-2 hover:text-primary transition-colors">
            {artist.title.rendered}
          </CardTitle>
        </Link>
        <div 
          className="text-sm text-muted-foreground line-clamp-3" 
          dangerouslySetInnerHTML={{ __html: artist.excerpt.rendered }} 
        />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-center">
        <Button asChild variant="link" className="text-primary">
          <Link href={artistLink}>
            View Profile &rarr;
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
