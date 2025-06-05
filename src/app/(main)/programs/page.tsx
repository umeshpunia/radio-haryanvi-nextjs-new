
import { Metadata } from 'next';
import { CalendarClockIcon } from 'lucide-react';
import { programSchedule, ProgramSlot } from '@/lib/program-schedule';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MobileSubPageHeader } from '@/components/layout/mobile-subpage-header';

export const metadata: Metadata = {
  title: 'Radio Programs - Radio Haryanvi',
  description: 'Check out the daily program schedule for Radio Haryanvi. Tune in for your favorite Haryanvi music, Ragnies, Bhajans, and more.',
  keywords: ['radio haryanvi programs', 'haryanvi radio schedule', 'haryanvi music timings', 'radio haryana programs'],
};

export default function ProgramsPage() {
  return (
    <>
      <MobileSubPageHeader title="Program Schedule" />
      <div className="container mx-auto px-4 py-8 md:py-0"> {/* Adjusted py for mobile */}
        <header className="mb-12 text-center">
          <CalendarClockIcon className="w-24 h-24 text-primary mx-auto mb-6" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
            Radio Haryanvi Program Schedule
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay tuned with our daily lineup of authentic Haryanvi music, cultural shows, and more. All timings are in IST (Indian Standard Time).
          </p>
        </header>

        <section className="max-w-2xl mx-auto space-y-6">
          {programSchedule.map((slot: ProgramSlot) => (
            <Card key={slot.name + slot.startHourIST} className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">{slot.name}</CardTitle>
                <CardDescription className="text-muted-foreground">{slot.displayTime} (IST)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Enjoy {slot.name.toLowerCase()} during this time slot.
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </>
  );
}
