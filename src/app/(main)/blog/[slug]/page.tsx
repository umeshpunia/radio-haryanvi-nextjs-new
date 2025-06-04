import { fetchPostBySlugApi, fetchAuthorApi, Post, Author } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata, ResolvingMetadata } from 'next';
import { CalendarDays, UserCircle } from 'lucide-react';

type Props = {
  params: { slug: string };
};

async function getPostData(slug: string): Promise<{ post: Post | null; author: Author | null }> {
  const post = await fetchPostBySlugApi(slug);
  if (!post) {
    return { post: null, author: null };
  }
  const author = post.author ? await fetchAuthorApi(post.author) : null;
  return { post, author };
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { post } = await getPostData(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const featuredImageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return {
    title: `${post.title.rendered} - Haryanvi Radio Hub Blog`,
    description: post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 160), // Plain text excerpt
    openGraph: {
      title: post.title.rendered,
      description: post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 160),
      type: 'article',
      publishedTime: post.date,
      authors: post._embedded?.author?.[0]?.name ? [post._embedded.author[0].name] : [],
      images: featuredImageUrl ? [featuredImageUrl, ...previousImages] : previousImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title.rendered,
      description: post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 160),
      images: featuredImageUrl ? [featuredImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { post, author } = await getPostData(params.slug);

  if (!post) {
    notFound();
  }

  const featuredImageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const authorName = author?.name || post._embedded?.author?.[0]?.name || 'Unknown Author';
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
          <div className="flex items-center space-x-1">
            <UserCircle className="h-4 w-4" />
            <span>By {authorName}</span>
          </div>
        </div>
      </header>

      {featuredImageUrl && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 shadow-lg">
          <Image
            src={featuredImageUrl}
            alt={post.title.rendered}
            layout="fill"
            objectFit="cover"
            priority
            data-ai-hint="blog post image"
          />
        </div>
      )}

      <div
        className="prose dark:prose-invert prose-lg max-w-none prose-headings:font-headline prose-headings:text-primary prose-a:text-primary hover:prose-a:text-accent transition-colors prose-img:rounded-md prose-img:shadow-md"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </article>
  );
}

// Enable ISR for blog posts if desired, or keep fully dynamic
// export async function generateStaticParams() {
//   const { posts } = await fetchPostsFromApi(1, undefined, 100); // Fetch a number of posts to pre-render
//   return posts.map((post) => ({
//     slug: post.slug,
//   }));
// }
// export const revalidate = 600; // Revalidate every 10 minutes
