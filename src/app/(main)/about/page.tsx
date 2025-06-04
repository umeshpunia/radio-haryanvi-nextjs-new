
import { Metadata } from 'next';
import { InfoIcon } from 'lucide-react'; // Or any appropriate icon

export const metadata: Metadata = {
  title: 'About Us - Radio Haryanvi',
  description: 'Learn more about Radio Haryanvi, our mission, and our team.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <InfoIcon className="w-24 h-24 text-primary mx-auto mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
          About Radio Haryanvi
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover our story and our passion for Haryanvi music and culture.
        </p>
      </header>

      <section className="max-w-3xl mx-auto space-y-8">
        <div className="p-6 bg-card rounded-lg shadow-lg">
          <h2 className="font-headline text-3xl font-semibold mb-3 text-primary">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Radio Haryanvi is dedicated to promoting the rich musical heritage of Haryana. We strive to be the premier platform for Haryanvi music lovers worldwide, offering a seamless listening experience, insightful articles, and a space to discover the diverse talents from the heartland of Haryana. Our goal is to connect listeners with the vibrant sounds and cultural narratives of the region.
          </p>
        </div>

        <div className="p-6 bg-card rounded-lg shadow-lg">
          <h2 className="font-headline text-3xl font-semibold mb-3 text-primary">What We Offer</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 leading-relaxed">
            <li>24/7 Live Haryanvi Radio Streaming (Coming Soon!)</li>
            <li>An extensive collection of Haryanvi music across various genres.</li>
            <li>Engaging blog posts about Haryanvi music, artists, culture, and history.</li>
            <li>A platform for emerging Haryanvi artists to showcase their talent.</li>
            <li>A user-friendly experience across all devices.</li>
          </ul>
        </div>

        <div className="p-6 bg-card rounded-lg shadow-lg">
          <h2 className="font-headline text-3xl font-semibold mb-3 text-primary">Join Our Community</h2>
          <p className="text-muted-foreground leading-relaxed">
            We are more than just a radio station; we are a community of Haryanvi music enthusiasts. Follow us on social media, subscribe to our newsletter for updates, and be a part of the Radio Haryanvi family. Let's celebrate the spirit of Haryanvi culture together!
          </p>
        </div>
      </section>
    </div>
  );
}
