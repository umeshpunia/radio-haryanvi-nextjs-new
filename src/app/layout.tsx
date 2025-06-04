import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { StoreProvider } from '@/lib/redux/provider';
import { Toaster } from "@/components/ui/toaster";
import { OfflineIndicator } from "@/components/offline-indicator";
import './globals.css';

export const metadata: Metadata = {
  title: 'Haryanvi Radio Hub',
  description: 'Your one-stop destination for Haryanvi music and culture.',
  openGraph: {
    title: 'Haryanvi Radio Hub',
    description: 'Your one-stop destination for Haryanvi music and culture.',
    type: 'website',
    locale: 'en_US',
    // url: 'https://your-domain.com', // Replace with your actual domain
    // siteName: 'Haryanvi Radio Hub',
    // images: [ { url: 'https://your-domain.com/og-image.png' } ], // Replace with your OG image
  },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'Haryanvi Radio Hub',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <StoreProvider>
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
        </StoreProvider>
      </body>
    </html>
  );
}
