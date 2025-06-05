
"use client";

import React, { useState, useEffect, useCallback } from 'react';
// import { Metadata } from 'next'; // Keep for potential static metadata if needed, but dynamic is better
import { Music3Icon, PlusCircleIcon, ListChecksIcon, Loader2 } from 'lucide-react';
import { RequestForm } from '@/components/requests/request-form';
import { RequestDisplayCard } from '@/components/requests/request-display-card';
import { MobileSubPageHeader } from '@/components/layout/mobile-subpage-header';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getSongRequests, SongRequest } from '@/services/request-service';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

// Metadata can be set statically here if needed, or dynamically if page becomes server component
// export const metadata: Metadata = { ... };


function RequestPageSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 p-6 border rounded-lg bg-card shadow-md">
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-4 w-1/2" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}


export default function SongRequestPage() {
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedRequests = await getSongRequests();
      console.log('Fetched Requests from Service:', fetchedRequests); // Diagnostic log
      setRequests(fetchedRequests);
    } catch (err: any) {
      console.error('Error in fetchRequests on page:', err); // Diagnostic log for errors
      setError(err.message || "Failed to load requests.");
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleFormSuccess = () => {
    fetchRequests(); // Refresh list after new submission
    // setIsFormOpen(false); // Form will call setOpen(false) internally
  };
  
  // Set document title dynamically
  useEffect(() => {
    document.title = "Song Requests - Radio Haryanvi";
  }, []);

  return (
    <>
      <MobileSubPageHeader title="Song Requests" />
      <div className="container mx-auto px-4 py-8 md:py-0">
        <header className="mb-8 text-center">
          <ListChecksIcon className="w-20 h-20 text-primary mx-auto mb-6" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
            Your Song Requests
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            View previously submitted Farmaish or add a new one.
          </p>
        </header>

        <div className="mb-8 flex justify-center">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <PlusCircleIcon className="mr-2 h-5 w-5" /> Submit New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Submit Your Song Request</DialogTitle>
                <DialogDescription>
                  Fill out the form below with your Farmaish, and we&apos;ll do our best to play it for you!
                </DialogDescription>
              </DialogHeader>
              <RequestForm onSuccess={handleFormSuccess} setOpen={setIsFormOpen} />
            </DialogContent>
          </Dialog>
        </div>

        <section className="max-w-3xl mx-auto">
          {isLoading && <RequestPageSkeleton />}
          {!isLoading && error && (
            <p className="text-center text-destructive py-10">
              Error: {error}
            </p>
          )}
          {!isLoading && !error && requests.length === 0 && (
            <p className="text-center text-muted-foreground py-10">
              No song requests found. Be the first to submit one!
            </p>
          )}
          {!isLoading && !error && requests.length > 0 && (
            <ScrollArea className="h-[calc(100vh-20rem)] md:h-auto"> {/* Adjust height as needed */}
              <div className="space-y-4 pr-3"> {/* Add padding for scrollbar */}
                {requests.map((request) => (
                  <RequestDisplayCard key={request.id} request={request} />
                ))}
              </div>
            </ScrollArea>
          )}
        </section>

        <section className="mt-16 text-center max-w-2xl mx-auto">
          <h2 className="font-headline text-2xl font-semibold mb-4 text-primary">How Requests Work</h2>
          <div className="space-y-3 text-muted-foreground text-left text-sm">
            <p>
              <strong className="text-foreground">Submission:</strong> Fill in all the required details accurately.
            </p>
            <p>
              <strong className="text-foreground">Consideration:</strong> While we try to accommodate all requests, playing a song depends on our program schedule, song availability, and the number of requests.
            </p>
            <p>
              <strong className="text-foreground">Tune In:</strong> Listen to Radio Haryanvi, especially during our "Farmaish" program slots, to hear if your song is played! (Check program schedule for timings).
            </p>
            <p className="mt-4">
              Thank you for being a part of the Radio Haryanvi community!
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
