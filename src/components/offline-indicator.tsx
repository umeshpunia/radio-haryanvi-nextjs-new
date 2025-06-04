"use client";

import { useEffect } from 'react';
import { useOfflineStatus } from '@/hooks/use-offline-status';
import { useToast } from '@/hooks/use-toast'; // Assuming useToast is in "@/hooks/use-toast"

export function OfflineIndicator() {
  const isOnline = useOfflineStatus();
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure this runs client-side
      if (isOnline) {
        // Optionally, show a "Back online" message if it was previously offline
        // For now, we only show when going offline.
        // toast({ title: "Connection Restored", description: "You are back online." });
      } else {
        toast({
          title: "Connection Lost",
          description: "You are currently offline. Some features may be unavailable.",
          variant: "destructive",
          duration: Infinity, // Keep toast until back online or dismissed
        });
      }
    }
  }, [isOnline, toast]);

  return null; // This component only renders toasts
}
