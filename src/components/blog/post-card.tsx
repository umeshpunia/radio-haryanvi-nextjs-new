import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/wordpress';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, UserCircle } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const featuredImageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://placehold.co/600x400.png`;
  const authorName = post._embedded?.author?.[0]?.name || 'Unknown Author';
  const postDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Link href={`/blog/${post.slug}`} aria-label={post.title.rendered}>
          <div className="relative w-full aspect-video">
            <Image
              src={featuredImageUrl}
              alt={post.title.rendered}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="blog article"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <Link href={`/blog/${post.slug}`}>
          <CardTitle className="font-headline text-xl md:text-2xl mb-2 line-clamp-2 hover:text-primary transition-colors">
            {post.title.rendered}
          </CardTitle>
        </Link>
        <div 
          className="text-sm text-muted-foreground line-clamp-3 mb-4" 
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} 
        />
        <div className="flex items-center text-xs text-muted-foreground space-x-4">
          <div className="flex items-center space-x-1">
            <CalendarDays className="h-4 w-4" />
            <span>{postDate}</span>
          </div>
          <div className="flex items-center space-x-1">
            <UserCircle className="h-4 w-4" />
            <span>{authorName}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild variant="link" className="p-0 h-auto text-primary">
          <Link href={`/blog/${post.slug}`}>
            Read More &rarr;
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
