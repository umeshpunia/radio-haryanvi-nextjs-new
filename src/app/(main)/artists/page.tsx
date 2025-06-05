
"use client";

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchArtists, setCurrentArtistsPage } from '@/lib/redux/slices/artists-slice';
import { ArtistCard } from '@/components/artists/artist-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, UsersIcon } from 'lucide-react';
import { MobileSubPageHeader } from '@/components/layout/mobile-subpage-header';
// import type { Metadata } from 'next'; // For static metadata if needed, though dynamic better here

export default function ArtistsPage() {
  const dispatch = useAppDispatch();
  const { artists, currentPage, totalPages, status, error, artistCategory } = useAppSelector((state) => state.artists);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      dispatch(fetchArtists(currentPage));
    }
  }, [dispatch, currentPage, isClient]);

  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentArtistsPage(newPage));
  };
  
  if (!isClient) { // Skeleton for initial SSR or prerender if this becomes server component
    return (
      <>
        <MobileSubPageHeader title="Haryanvi Artists" />
        <div className="container mx-auto px-4 py-8 md:py-0"> {/* Adjusted py for mobile */}
          <ArtistsPageSkeleton />
        </div>
      </>
    );
  }

  return (
    <>
      <MobileSubPageHeader title="Haryanvi Artists" />
      <div className="container mx-auto px-4 py-8 md:py-0"> {/* Adjusted py for mobile */}
        <header className="mb-8 text-center">
          <UsersIcon className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-2">
            Haryanvi Artists
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover talented Haryanvi artists and their work.
          </p>
          {artistCategory && status === 'succeeded' && (
            <p className="text-sm text-muted-foreground mt-1">
              Displaying artists from category: {artistCategory.name}
            </p>
          )}
        </header>

        {status === 'loading' && <ArtistsPageSkeleton />}
        {status === 'failed' && (
          <div className="text-center text-destructive py-10">
              <p className="font-semibold text-lg">Error loading artists.</p>
              <p>{error || "An unknown error occurred."}</p>
              {error?.includes("Category 'artists' not found") && (
                  <p className="mt-2 text-sm text-muted-foreground">
                      Please ensure a WordPress category with the slug &apos;artists&apos; exists and has posts.
                  </p>
              )}
          </div>
        )}
        
        {status === 'succeeded' && artists.length === 0 && (
          <p className="text-center text-muted-foreground py-10">
            No artists found. Check back soon or ensure the &apos;artists&apos; category in WordPress has published posts.
          </p>
        )}

        {status !== 'loading' && artists.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        )}

        {status === 'succeeded' && totalPages > 1 && (
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
    </>
  );
}

function ArtistsPageSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-8 mb-8 mt-8 md:mt-0">
        {[...Array(6)].map((_, i) => (
          <ArtistCardSkeleton key={i} />
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

function ArtistCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 p-4 border rounded-lg bg-card">
      <Skeleton className="h-[200px] w-full rounded-md aspect-square" />
      <div className="space-y-2 text-center pt-2">
        <Skeleton className="h-6 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-full mx-auto" />
        <Skeleton className="h-4 w-5/6 mx-auto" />
      </div>
      <Skeleton className="h-8 w-28 mt-2 mx-auto" />
    </div>
  );
}

export const dynamic = 'force-dynamic';
