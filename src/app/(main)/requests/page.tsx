
"use client";

import React, { useState, useEffect, useCallback } from 'react';
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
      </div>
      <Skeleton className="h-4 w-1/2" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
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
      // console.log('Fetched Requests from Service on Page:', fetchedRequests);
      setRequests(fetchedRequests);
    } catch (err: any) {
      // console.error('Error in fetchRequests on page:', err);
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
    fetchRequests();
    // setIsFormOpen(false); // Form calls setOpen(false) internally if needed
  };
  
  useEffect(() => {
    document.title = "Song Requests - Radio Haryanvi";
  }, []);

  const addRequestIconTrigger = (
    <DialogTrigger asChild>
      <Button variant="ghost" size="icon" className="text-primary" aria-label="Add new song request">
        <PlusCircleIcon className="h-6 w-6" />
      </Button>
    </DialogTrigger>
  );

  return (
    // Dialog root wraps the entire content that can trigger or display the dialog
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <MobileSubPageHeader title="Song Requests" actionButton={addRequestIconTrigger} />
      <div className="container mx-auto px-4 py-8 md:py-0 flex flex-col h-full">
        <header className="mb-8 text-center">
          <ListChecksIcon className="w-20 h-20 text-primary mx-auto mb-6" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
            Your Song Requests
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            View previously submitted Farmaish or add a new one.
          </p>
        </header>

        {/* Centered "Submit New Request" button, hidden on mobile (md:flex) */}
        <div className="mb-8 hidden md:flex justify-center">
          <DialogTrigger asChild>
            <Button size="lg">
              <PlusCircleIcon className="mr-2 h-5 w-5" /> Submit New Request
            </Button>
          </DialogTrigger>
        </div>

        <section className="max-w-3xl mx-auto w-full flex-grow overflow-hidden">
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
             <ScrollArea className="h-full"> 
              <div className="space-y-4 pr-3 pb-4">
                {requests.map((request) => (
                  <RequestDisplayCard key={request.id} request={request} />
                ))}
              </div>
            </ScrollArea>
          )}
        </section>

        <section className="mt-10 text-center max-w-2xl mx-auto pb-4">
          <h2 className="font-headline text-2xl font-semibold mb-4 text-primary">How Requests Work</h2>
          <div className="space-y-3 text-muted-foreground text-left text-sm">
            <p>
              <strong className="text-foreground">Submission:</strong> Fill in all the required details accurately.
            </p>
            <p>
              <strong className="text-foreground">Consideration:</strong> While we try to accommodate all requests, playing a song depends on our program schedule and song availability.
            </p>
            <p>
              <strong className="text-foreground">Tune In:</strong> Listen to Radio Haryanvi to hear if your song is played!
            </p>
            <p className="mt-4">
              Thank you for being a part of the Radio Haryanvi community!
            </p>
          </div>
        </section>
      </div>
      
      {/* DialogContent is a direct child of Dialog, rendered based on isFormOpen state */}
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Your Song Request</DialogTitle>
          <DialogDescription>
            Fill out the form below with your Farmaish.
          </DialogDescription>
        </DialogHeader>
        <RequestForm onSuccess={handleFormSuccess} setOpen={setIsFormOpen} />
      </DialogContent>
    </Dialog>
  );
}
