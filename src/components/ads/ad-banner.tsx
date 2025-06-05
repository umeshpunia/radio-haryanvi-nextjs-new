
"use client";

import React, { useEffect, useRef } from 'react';
import { useAppSettings } from '@/contexts/app-settings-context';
import { cn } from '@/lib/utils';

interface AdBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  adSlot: string; // Your AdSense ad slot ID
  adFormat?: string; // e.g., "auto", "rectangle", "vertical", "horizontal"
  isResponsive?: boolean; // data-full-width-responsive="true"
  adLayoutKey?: string; // For In-feed ads, e.g. "-gw-M6O51T_v8wtdGgM"
  // Add other ad-specific attributes as needed
}

export function AdBanner({
  adSlot,
  adFormat = "auto",
  isResponsive = true,
  adLayoutKey,
  className,
  ...props
}: AdBannerProps) {
  const { ads: adsEnabled } = useAppSettings();
  const adRef = useRef<HTMLModElement>(null); // Changed from HTMLDivElement to HTMLModElement for <ins>

  // IMPORTANT: Replace with your actual AdSense Publisher ID
  const adsensePublisherId = "ca-pub-YOUR_ADSENSE_PUBLISHER_ID";

  useEffect(() => {
    if (adsEnabled && adRef.current && adsensePublisherId !== "ca-pub-YOUR_ADSENSE_PUBLISHER_ID") {
      // Check if the ad script has already processed this slot
      // AdSense typically marks elements it has processed with `data-adsbygoogle-status`
      if (adRef.current.children.length === 0 && !adRef.current.getAttribute('data-adsbygoogle-status')) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error("Error pushing AdSense ad:", e);
        }
      }
    }
  }, [adsEnabled, adSlot]); // Re-run if adsEnabled or adSlot changes

  if (!adsEnabled || adsensePublisherId === "ca-pub-YOUR_ADSENSE_PUBLISHER_ID") {
    // Optionally render a placeholder or nothing if ads are disabled or publisher ID is not set
    return (
      <div className={cn("text-center p-4 bg-muted/50 border border-dashed rounded-md", className)} {...props}>
        <p className="text-sm text-muted-foreground">Advertisement Placeholder (Ads Disabled or Publisher ID not set)</p>
      </div>
    );
  }

  return (
    <div className={cn("flex justify-center items-center min-h-[100px] bg-muted/30", className)} {...props}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsensePublisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={isResponsive ? "true" : "false"}
        {...(adLayoutKey && { 'data-ad-layout-key': adLayoutKey })}
      >
      </ins>
    </div>
  );
}
