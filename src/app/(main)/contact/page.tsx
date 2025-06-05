
import { Metadata } from 'next';
import { MailIcon } from 'lucide-react';
import { ContactForm } from '@/components/contact/contact-form';
import { MobileSubPageHeader } from '@/components/layout/mobile-subpage-header';

export const metadata: Metadata = {
  title: 'Contact Us - Radio Haryanvi',
  description: 'Get in touch with the Radio Haryanvi team by filling out our contact form or finding our contact details.',
};

export default function ContactPage() {
  return (
    <>
      <MobileSubPageHeader title="Contact Us" />
      <div className="container mx-auto px-4 py-8 md:py-0"> {/* Adjusted py for mobile */}
        <header className="mb-12 text-center">
          <MailIcon className="w-24 h-24 text-primary mx-auto mb-6" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
            Contact Radio Haryanvi
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            We&apos;d love to hear from you! Please fill out the form below to send us a message. Whether you have a question, feedback, or a collaboration idea, feel free to reach out.
          </p>
        </header>

        <section className="max-w-2xl mx-auto">
          <ContactForm />
        </section>

        <section className="mt-16 text-center max-w-2xl mx-auto">
          <h2 className="font-headline text-2xl font-semibold mb-4 text-primary">Other Ways to Reach Us</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              For urgent matters or direct inquiries, you can also reach us via:
            </p>
            <p>
              <strong>General Inquiries:</strong> <a href="mailto:info@radioharyanvi.com" className="text-primary hover:underline">info@radioharyanvi.com</a>
            </p>
            <p>
              <strong>Artist Submissions:</strong> <a href="mailto:submissions@radioharyanvi.com" className="text-primary hover:underline">submissions@radioharyanvi.com</a>
            </p>
            <p className="mt-6">
              <strong>Mailing Address:</strong><br />
              Radio Haryanvi Headquarters <br />
              123 Music Lane <br />
              Chandigarh, Haryana 160001 <br />
              India
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
