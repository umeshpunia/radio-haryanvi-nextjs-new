
import { Metadata } from 'next';
import { Music3Icon } from 'lucide-react'; // Or another suitable icon
import { RequestForm } from '@/components/requests/request-form';
import { MobileSubPageHeader } from '@/components/layout/mobile-subpage-header';

export const metadata: Metadata = {
  title: 'Song Request (Farmaish) - Radio Haryanvi',
  description: 'Request your favorite Haryanvi songs and Ragnis to be played on Radio Haryanvi. Submit your farmaish here!',
};

export default function SongRequestPage() {
  return (
    <>
      <MobileSubPageHeader title="Song Request" />
      <div className="container mx-auto px-4 py-8 md:py-0">
        <header className="mb-12 text-center">
          <Music3Icon className="w-24 h-24 text-primary mx-auto mb-6" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
            Submit Your Song Request
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Want to hear your favorite Haryanvi song or Ragni on air? Fill out the form below with your Farmaish, and we&apos;ll do our best to play it for you!
          </p>
        </header>

        <section className="max-w-2xl mx-auto">
          <RequestForm />
        </section>

        <section className="mt-16 text-center max-w-2xl mx-auto">
          <h2 className="font-headline text-2xl font-semibold mb-4 text-primary">How Requests Work</h2>
          <div className="space-y-3 text-muted-foreground text-left">
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
