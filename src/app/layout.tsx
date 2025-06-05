
import type { Metadata } from 'next';
import Script from 'next/script';
import { ThemeProvider } from '@/components/theme-provider';
import { StoreProvider } from '@/lib/redux/provider';
import { Toaster } from "@/components/ui/toaster";
import { OfflineIndicator } from "@/components/offline-indicator";
import { getAppDetails } from '@/services/app-details-service';
import { AppSettingsProvider } from '@/contexts/app-settings-context';
import './globals.css';

// It's better to define metadata as an object
export const metadata: Metadata = {
  title: 'Radio Haryanvi',
  description: 'Your one-stop destination for Haryanvi music and culture.',
  openGraph: {
    title: 'Radio Haryanvi',
    description: 'Your one-stop destination for Haryanvi music and culture.',
    type: 'website',
    locale: 'en_US',
    // url: 'https://your-domain.com', // Replace with your actual domain
    // siteName: 'Radio Haryanvi',
    // images: [ { url: 'https://your-domain.com/og-image.png' } ], // Replace with your OG image
  },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'Radio Haryanvi',
  //   description: 'Your one-stop destination for Haryanvi music and culture.',
  //   creator: '@yourtwitterhandle', // Replace
  //   images: ['https://your-domain.com/twitter-image.png'], // Replace
  // },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const appDetails = await getAppDetails();
  const adsEnabled = appDetails?.ads || false;
  // IMPORTANT: Replace with your actual AdSense Publisher ID
  const adsensePublisherId = "ca-pub-YOUR_ADSENSE_PUBLISHER_ID";


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
        {adsEnabled && adsensePublisherId !== "ca-pub-YOUR_ADSENSE_PUBLISHER_ID" && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive" // 'lazyOnload' or 'afterInteractive'
          />
        )}
      </head>
      <body className="font-body antialiased">
        <StoreProvider>
          <AppSettingsProvider settings={appDetails ? { ads: appDetails.ads, message: appDetails.message, showMessage: appDetails.showMessage } : null}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
              <OfflineIndicator />
            </ThemeProvider>
          </AppSettingsProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
