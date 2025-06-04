"use client";

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchPosts, fetchCategories, setCurrentPage, setSelectedCategory } from '@/lib/redux/slices/blog-slice';
import { PostCard } from '@/components/blog/post-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, RssIcon } from 'lucide-react';

// No specific metadata here as it's a client component. Metadata should be in a parent server component or layout if needed globally.

export default function BlogPage() {
  const dispatch = useAppDispatch();
  const { posts, categories, currentPage, totalPages, selectedCategory, status, error } = useAppSelector((state) => state.blog);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isClient) {
      dispatch(fetchPosts({ page: currentPage, categoryId: selectedCategory || undefined }));
    }
  }, [dispatch, currentPage, selectedCategory, isClient]);

  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage));
  };

  const handleCategoryChange = (categoryId: string) => {
    dispatch(setSelectedCategory(categoryId === "all" ? null : Number(categoryId)));
  };
  
  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BlogPageSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <RssIcon className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-2">
          Haryanvi Radio Hub Blog
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover articles about Haryanvi music, culture, artists, and more.
        </p>
      </header>

      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>
        <div className="w-full sm:w-auto min-w-[200px]">
          <Select onValueChange={handleCategoryChange} value={selectedCategory?.toString() || "all"}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name} ({category.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {status === 'loading' && <BlogPageSkeleton />}
      {status === 'failed' && <p className="text-center text-destructive">Error loading posts: {error}</p>}
      
      {status === 'succeeded' && posts.length === 0 && (
        <p className="text-center text-muted-foreground">No posts found for this category or page.</p>
      )}

      {status !== 'loading' && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || status === 'loading'}
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <span className="text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || status === 'loading'}
          >
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

function BlogPageSkeleton() {
  return (
    <>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-full sm:w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {[...Array(6)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="flex justify-center items-center space-x-4 mt-8">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 p-4 border rounded-lg bg-card">
      <Skeleton className="h-[180px] w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <Skeleton className="h-8 w-24 mt-2" />
    </div>
  );
}

export const dynamic = 'force-dynamic'; // Ensure fresh data for blog page
