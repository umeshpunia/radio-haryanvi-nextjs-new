
"use client";

import { useEffect, useRef } from 'react';
import { useOfflineStatus } from '@/hooks/use-offline-status';
import { useToast } from '@/hooks/use-toast'; 

export function OfflineIndicator() {
  const isOnline = useOfflineStatus();
  const { toast, dismiss } = useToast(); // toast is the function to create a toast, dismiss is the function to close one
  const offlineToastIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return; // Ensure this runs only on the client
    }

    if (isOnline) {
      // If we were previously tracking an offline toast
      if (offlineToastIdRef.current) {
        dismiss(offlineToastIdRef.current); // Dismiss the "Connection Lost" toast
        offlineToastIdRef.current = null;   // Reset the ref
        
        toast({ // Show "Connection Restored" toast
          title: "Connection Restored",
          description: "You are back online.",
          duration: 5000, // Display for 5 seconds
        });
      }
    } else {
      // If offline and we are not already tracking an offline toast from this component
      if (!offlineToastIdRef.current) {
        const { id } = toast({ // Show "Connection Lost" toast
          title: "Connection Lost",
          description: "You are currently offline. Some features may be unavailable.",
          variant: "destructive",
          duration: Infinity, // Keep this toast until explicitly dismissed or connection restored
        });
        offlineToastIdRef.current = id; // Store the ID of this toast
      }
    }
  }, [isOnline, toast, dismiss]); // Dependencies for the effect

  return null; // This component only renders toasts, nothing in the DOM directly
}

