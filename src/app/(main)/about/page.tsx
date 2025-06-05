
import { Metadata } from 'next';
import { InfoIcon, Music2Icon, UsersIcon, RssIcon } from 'lucide-react';
import { MobileSubPageHeader } from '@/components/layout/mobile-subpage-header';

export const metadata: Metadata = {
  title: 'About Us - Radio Haryanvi',
  description: 'Learn more about Radio Haryanvi, our mission, our commitment to Haryanvi music and culture, and our vibrant community.',
};

export default function AboutPage() {
  return (
    <>
      <MobileSubPageHeader title="About Us" />
      <div className="container mx-auto px-4 py-8 md:py-0"> {/* Adjusted py for mobile */}
        <header className="mb-12 text-center">
          <InfoIcon className="w-24 h-24 text-primary mx-auto mb-6" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
            About Radio Haryanvi
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our story, our passion for Haryanvi music and culture, and our dedication to bringing the heartland's rhythm to the world.
          </p>
        </header>

        <section className="max-w-3xl mx-auto space-y-10">
          <div className="p-6 bg-card rounded-lg shadow-xl">
            <div className="flex items-center mb-4">
              <Music2Icon className="w-10 h-10 text-primary mr-4 flex-shrink-0" />
              <h2 className="font-headline text-3xl font-semibold text-primary">Our Mission</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-base">
              Radio Haryanvi is passionately dedicated to preserving, promoting, and celebrating the rich and diverse musical heritage of Haryana. We strive to be the premier global platform for Haryanvi music enthusiasts, offering an authentic and immersive listening experience. Our core goal is to bridge the past with the present, connecting listeners worldwide with the vibrant sounds, timeless folk tales, and unique cultural narratives that define Haryana. We aim to be a beacon for Haryanvi art, fostering a deeper appreciation and understanding of its traditional and contemporary forms.
            </p>
          </div>

          <div className="p-6 bg-card rounded-lg shadow-xl">
            <div className="flex items-center mb-4">
              <RssIcon className="w-10 h-10 text-primary mr-4 flex-shrink-0" />
              <h2 className="font-headline text-3xl font-semibold text-primary">What We Offer</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4 text-base">
              At Radio Haryanvi, we are committed to providing a comprehensive and engaging experience for our listeners. Our offerings include:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-3 leading-relaxed text-base">
              <li>
                <strong>24/7 Live Haryanvi Radio Streaming:</strong> (Coming Soon!) Continuous playback of Haryanvi music, spanning classic folk songs, Ragnis, Saangs, Bhajans, and the latest contemporary hits.
              </li>
              <li>
                <strong>Extensive Music Library:</strong> An ever-growing collection of Haryanvi music across diverse genres, including Lok Geet, devotional music, modern pop, and DJ remixes.
              </li>
              <li>
                <strong>Engaging Blog Content:</strong> Insightful articles, artist spotlights, historical perspectives on Haryanvi music, cultural deep-dives, and updates on regional music events.
              </li>
              <li>
                <strong>Artist Promotion Platform:</strong> A dedicated space for emerging and established Haryanvi artists to showcase their talent, share their stories, and connect with a wider audience.
              </li>
              <li>
                <strong>Cultural Showcase:</strong> Features on Haryanvi festivals, traditions, poetry, and linguistic nuances, providing a holistic cultural experience.
              </li>
              <li>
                <strong>User-Friendly Experience:</strong> A seamlessly designed platform, accessible across all devices, ensuring you can tune in anytime, anywhere.
              </li>
              <li>
                <strong>Community Interaction:</strong> (Future Feature) Song requests, dedications, and interactive shows to make your listening experience personal and engaging.
              </li>
            </ul>
          </div>

          <div className="p-6 bg-card rounded-lg shadow-xl">
            <div className="flex items-center mb-4">
              <UsersIcon className="w-10 h-10 text-primary mr-4 flex-shrink-0" />
              <h2 className="font-headline text-3xl font-semibold text-primary">Join Our Community</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-base">
              Radio Haryanvi is more than just a radio station; we are a thriving community of Haryanvi music lovers, cultural enthusiasts, artists, and storytellers. We believe in the power of music to unite and inspire. We invite you to become an active part of our family:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 leading-relaxed mt-3 text-base">
              <li>Follow us on social media for daily updates, behind-the-scenes content, and interactive discussions.</li>
              <li>Subscribe to our newsletter for exclusive content, program highlights, and special announcements.</li>
              <li>Share your favorite Haryanvi tracks, memories, and cultural insights with us and fellow listeners.</li>
              <li>Support local Haryanvi artists by listening to their music and sharing their work.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4 text-base">
              Let&apos;s celebrate the indomitable spirit and rich cultural tapestry of Haryana together! Your voice, your participation, and your passion are what make Radio Haryanvi truly special.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
