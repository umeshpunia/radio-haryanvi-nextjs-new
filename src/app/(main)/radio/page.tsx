import { Metadata } from 'next';
import { RadioIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Live Radio - Haryanvi Radio Hub',
  description: 'Tune into live Haryanvi music streams 24/7.',
};

export default function RadioPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center">
        <RadioIcon className="w-24 h-24 text-primary mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">
          Haryanvi Live Radio
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl">
          Get ready to groove to the best Haryanvi tunes! Our live radio is currently under construction, but we're working hard to bring you an amazing listening experience soon.
        </p>
        <div className="p-8 bg-card rounded-lg shadow-md w-full max-w-md">
          <h2 className="font-headline text-2xl font-semibold mb-3">Coming Soon!</h2>
          <p className="text-muted-foreground">
            Stay tuned for updates. We'll be launching our live streaming service with a wide variety of Haryanvi music genres, artist spotlights, and much more.
          </p>
        </div>
      </div>
    </div>
  );
}
