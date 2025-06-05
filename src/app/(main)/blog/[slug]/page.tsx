
"use client";

import { useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { CalendarDays, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchPostBySlug, clearCurrentPost } from '@/lib/redux/slices/blog-slice';
import { Skeleton } from '@/components/ui/skeleton';

// Static metadata for client component
export const metadata: Metadata = {
  title: 'Blog Post - Radio Haryanvi',
  description: 'Read our latest blog post on Radio Haryanvi.',
};

function BlogPostSkeleton() {
  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <div className="flex items-center text-sm text-muted-foreground space-x-4">
          <Skeleton className="h-5 w-24" />
        </div>
      </header>
      <Skeleton className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 shadow-lg" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
      </div>
    </article>
  );
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const dispatch = useAppDispatch();
  const { currentPost: post, status, error } = useAppSelector((state) => state.blog);

  useEffect(() => {
    if (slug) {
      dispatch(fetchPostBySlug(slug));
    }
    // Cleanup function to clear the current post when the component unmounts or slug changes
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    // If the status is succeeded and the post is null (meaning API returned null or post not found)
    // or if the status is failed, trigger notFound.
    if ((status === 'succeeded' && !post && slug) || status === 'failed') {
      notFound();
    }
  }, [status, post, error, slug]);

  if (status === 'loading' || (status === 'idle' && !post)) {
    return <BlogPostSkeleton />;
  }

  if (!post) {
    // This case should ideally be caught by the useEffect above to trigger notFound,
    // but as a fallback or if notFound hasn't redirected yet:
    return <BlogPostSkeleton />; // Or a more specific "Post not found" message before notFound kicks in
  }

  const featuredImageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const postDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-8">
        <h1
          className="font-headline text-3xl md:text-5xl font-bold mb-4 text-primary"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <div className="flex items-center text-sm text-muted-foreground space-x-4">
          <div className="flex items-center space-x-1">
            <CalendarDays className="h-4 w-4" />
            <span>{postDate}</span>
          </div>
        </div>
      </header>

      {featuredImageUrl && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 shadow-lg">
          <Image
            src={featuredImageUrl}
            alt={post.title.rendered}
            fill // Changed from layout="fill" and objectFit="cover"
            style={{ objectFit: 'cover' }} // Replaced objectFit prop with style
            priority
            data-ai-hint="blog post image"
          />
        </div>
      )}

      <div
        className="prose dark:prose-invert prose-lg max-w-none prose-headings:font-headline prose-headings:text-primary prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-blockquote:text-muted-foreground prose-a:text-primary hover:prose-a:text-accent transition-colors prose-img:rounded-md prose-img:shadow-md"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </article>
  );
}

// Ensure dynamic behavior for this page as it relies on client-side fetching based on slug
export const dynamic = 'force-dynamic';
