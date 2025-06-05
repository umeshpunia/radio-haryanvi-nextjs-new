
"use client";

import { useEffect, useState } from 'react';
import type { Metadata } from 'next';
import { SmartphoneIcon, HelpCircleIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Note: Client components cannot directly export 'metadata'. 
// It would typically be in a parent server component or layout.
// export const metadata: Metadata = {
//   title: 'Device Information - Radio Haryanvi',
//   description: 'View technical details about your current device, browser, and connection settings.',
// };

interface DeviceInfo {
  userAgent?: string;
  platform?: string;
  language?: string;
  languages?: string[];
  isOnline?: boolean;
  screenWidth?: number;
  screenHeight?: number;
  windowWidth?: number;
  windowHeight?: number;
  colorDepth?: number;
  pixelRatio?: number;
  cookiesEnabled?: boolean;
  doNotTrack?: string | null;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  connection?: {
    effectiveType?: string;
    rtt?: number;
    downlink?: number;
  };
  timezone?: string;
  isTouchScreen?: boolean;
}

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
  description?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, description }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between py-3 border-b border-border/50 last:border-b-0">
      <div className="flex items-center mb-1 sm:mb-0">
        <dt className="text-sm font-medium text-foreground">{label}</dt>
        {description && (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircleIcon className="h-4 w-4 text-muted-foreground ml-2 cursor-help flex-shrink-0" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs z-10"> {/* Ensure tooltip is above other content */}
                <p>{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <dd className="text-sm text-muted-foreground sm:ml-4 text-left sm:text-right break-words max-w-full sm:max-w-[60%]">
        {value === undefined || value === null || (typeof value === 'string' && value.trim() === '') ? (
          <span className="italic">N/A</span>
        ) : typeof value === 'boolean' ? (
          value ? 'Yes' : 'No'
        ) : (
          String(value)
        )}
      </dd>
    </div>
  );
};


export default function DeviceInfoPage() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set document title dynamically for client components
    document.title = 'Device Information - Radio Haryanvi';

    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const info: DeviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        languages: Array.from(navigator.languages || []),
        isOnline: navigator.onLine,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        colorDepth: window.screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack === null || navigator.doNotTrack === undefined ? 'Not specified' : navigator.doNotTrack,
        deviceMemory: (navigator as any).deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency,
        connection: (navigator as any).connection ? {
          effectiveType: (navigator as any).connection.effectiveType,
          rtt: (navigator as any).connection.rtt,
          downlink: (navigator as any).connection.downlink,
        } : undefined,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        isTouchScreen: ('ontouchstart' in window) || (navigator.maxTouchPoints > 0),
      };
      setDeviceInfo(info);
    }
    setIsLoading(false);
  }, []);

  const renderInfoItems = (info: DeviceInfo | null) => {
    if (!info) return null;
    return (
      <dl>
        <InfoItem label="User Agent" value={info.userAgent} description="The browser's user agent string." />
        <InfoItem label="Platform" value={info.platform} description="The platform on which the browser is running (e.g., Win32, MacIntel, Linux armv8l)." />
        <InfoItem label="Preferred Language" value={info.language} description="The preferred language of the user, usually the language of the browser UI." />
        <InfoItem label="Configured Languages" value={info.languages?.join(', ')} description="An array of strings representing the user's preferred languages, in order of preference." />
        <InfoItem label="Online Status" value={info.isOnline} description="Indicates whether the browser is currently online." />
        <InfoItem label="Screen Resolution" value={`${info.screenWidth} x ${info.screenHeight} pixels`} description="The total width and height of the user's screen." />
        <InfoItem label="Window (Viewport) Size" value={`${info.windowWidth} x ${info.windowHeight} pixels`} description="The width and height of the browser window's content area (layout viewport)." />
        <InfoItem label="Color Depth" value={`${info.colorDepth}-bit`} description="The number of bits used to display colors on the screen." />
        <InfoItem label="Device Pixel Ratio" value={info.pixelRatio} description="The ratio of the resolution in physical pixels to the resolution in CSS pixels for the current display device." />
        <InfoItem label="Cookies Enabled" value={info.cookiesEnabled} description="Indicates whether cookies are enabled in the browser." />
        <InfoItem label="Do Not Track" value={info.doNotTrack} description="The user's Do Not Track preference (0=Allowed, 1=Not Allowed, null/unspecified=No Preference)." />
        {info.deviceMemory !== undefined && <InfoItem label="Device Memory (GB approx.)" value={`${info.deviceMemory}`} description="Approximate amount of device RAM in gigabytes (if reported by browser, e.g., 0.25, 0.5, 1, 2, 4, 8+)." />}
        {info.hardwareConcurrency !== undefined && <InfoItem label="CPU Cores (Logical)" value={info.hardwareConcurrency} description="Number of logical processor cores available to the browser (if reported)." />}
        {info.connection && (
          <>
            <InfoItem label="Connection Type" value={info.connection.effectiveType} description="Effective type of the connection (e.g., 'slow-2g', '2g', '3g', or '4g'). Based on recently observed rtt and downlink values." />
            {info.connection.rtt !== undefined && <InfoItem label="Round Trip Time (RTT)" value={`${info.connection.rtt} ms`} description="Estimated effective round-trip time of the current connection, rounded to the nearest 25 milliseconds." />}
            {info.connection.downlink !== undefined && <InfoItem label="Downlink Speed (Mbps)" value={`${info.connection.downlink} Mbps`} description="Effective bandwidth estimate in megabits per second, rounded to the nearest 25 kilobits per second." />}
          </>
        )}
        <InfoItem label="Timezone" value={info.timezone} description="The user's IANA time zone name (e.g., 'America/New_York', 'Asia/Kolkata')." />
        <InfoItem label="Touch Screen Support" value={info.isTouchScreen} description="Indicates if the device likely supports touch input." />
      </dl>
    );
  };

  const renderSkeletons = () => (
    <dl>
      {[...Array(12)].map((_, i) => (
        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-border/50 last:border-b-0">
          <Skeleton className="h-5 w-1/3 mb-1 sm:mb-0 rounded-md" />
          <Skeleton className="h-5 w-1/2 rounded-md" />
        </div>
      ))}
    </dl>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <SmartphoneIcon className="w-20 h-20 text-primary mx-auto mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
          Device Information
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Here&apos;s some information about the device and browser you are currently using.
        </p>
      </header>

      <section className="max-w-3xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Client Details</CardTitle>
            <CardDescription>
              This information is gathered directly from your browser.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? renderSkeletons() : renderInfoItems(deviceInfo)}
          </CardContent>
        </Card>
      </section>
       <section className="mt-10 text-center max-w-2xl mx-auto">
         <p className="text-sm text-muted-foreground">
          Note: The accuracy and availability of this information can vary between browsers and devices. Some information might be generalized or not reported by your browser for privacy reasons. This information is not stored by Radio Haryanvi.
        </p>
      </section>
    </div>
  );
}
