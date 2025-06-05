
import { Metadata } from 'next';
import Link from 'next/link';
import {
  SettingsIcon,
  CalendarClockIcon,
  ShieldCheckIcon,
  InfoIcon,
  MailIcon,
  ChevronRightIcon,
  LayoutGridIcon,
  Gamepad2Icon,
  UsersIcon, // Added UsersIcon for Artists
  SmartphoneIcon // Added for Device Info
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'More Options - Radio Haryanvi',
  description: 'Explore additional pages like settings, program schedules, privacy policy, about us, contact information, games, artists, and device info for Radio Haryanvi.',
};

interface MoreLinkItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const moreLinks: MoreLinkItem[] = [
  {
    href: '/settings',
    label: 'App Settings',
    icon: <SettingsIcon className="h-6 w-6 text-primary" />,
    description: 'Manage your application theme and preferences.',
  },
  {
    href: '/programs',
    label: 'Program Schedule',
    icon: <CalendarClockIcon className="h-6 w-6 text-primary" />,
    description: 'View our daily radio program lineup.',
  },
  {
    href: '/artists', 
    label: 'Haryanvi Artists',
    icon: <UsersIcon className="h-6 w-6 text-primary" />,
    description: 'Discover talented Haryanvi artists.',
  },
  {
    href: '/about',
    label: 'About Us',
    icon: <InfoIcon className="h-6 w-6 text-primary" />,
    description: 'Learn more about Radio Haryanvi and our mission.',
  },
  {
    href: '/contact',
    label: 'Contact Us',
    icon: <MailIcon className="h-6 w-6 text-primary" />,
    description: 'Get in touch with the Radio Haryanvi team.',
  },
  {
    href: '/privacy',
    label: 'Privacy Policy',
    icon: <ShieldCheckIcon className="h-6 w-6 text-primary" />,
    description: 'Read our privacy policy.',
  },
  {
    href: '/flappy-bird',
    label: 'Flappy Bird Game',
    icon: <Gamepad2Icon className="h-6 w-6 text-primary" />,
    description: 'Play a fun retro game.',
  },
  {
    href: '/device-info',
    label: 'Device Info',
    icon: <SmartphoneIcon className="h-6 w-6 text-primary" />,
    description: 'View information about your current device and browser.',
  },
];

export default function MorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <LayoutGridIcon className="w-20 h-20 text-primary mx-auto mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
          More Options
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover more about Radio Haryanvi and access additional features.
        </p>
      </header>

      <section className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-center md:text-left">Explore</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {moreLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between p-4 bg-card hover:bg-accent/50 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center space-x-4">
                      {item.icon}
                      <div>
                        <span className="font-semibold text-base group-hover:text-primary">{item.label}</span>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
