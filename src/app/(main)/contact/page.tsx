
import { Metadata } from 'next';
import { MailIcon, PhoneIcon } from 'lucide-react'; // Or any appropriate icons

export const metadata: Metadata = {
  title: 'Contact Us - Radio Haryanvi',
  description: 'Get in touch with the Radio Haryanvi team.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <MailIcon className="w-24 h-24 text-primary mx-auto mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
          Contact Radio Haryanvi
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          We'd love to hear from you! Whether you have a question, feedback, or a collaboration idea, feel free to reach out.
        </p>
      </header>

      <section className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-card rounded-lg shadow-lg">
          <h2 className="font-headline text-2xl font-semibold mb-3 text-primary">General Inquiries</h2>
          <p className="text-muted-foreground mb-2">
            For general questions or feedback, please email us at:
          </p>
          <a href="mailto:info@radioharyanvi.com" className="text-primary hover:underline break-all">
            info@radioharyanvi.com
          </a>
        </div>

        <div className="p-6 bg-card rounded-lg shadow-lg">
          <h2 className="font-headline text-2xl font-semibold mb-3 text-primary">Artist Submissions</h2>
          <p className="text-muted-foreground mb-2">
            Are you a Haryanvi artist? Submit your music to:
          </p>
          <a href="mailto:submissions@radioharyanvi.com" className="text-primary hover:underline break-all">
            submissions@radioharyanvi.com
          </a>
        </div>
        
        <div className="p-6 bg-card rounded-lg shadow-lg md:col-span-2">
          <h2 className="font-headline text-2xl font-semibold mb-3 text-primary">Mailing Address</h2>
          <p className="text-muted-foreground">
            Radio Haryanvi Headquarters <br />
            123 Music Lane <br />
            Chandigarh, Haryana 160001 <br />
            India
          </p>
        </div>
        
        {/* Placeholder for a contact form if needed in the future */}
        {/* <div className="p-6 bg-card rounded-lg shadow-lg md:col-span-2">
          <h2 className="font-headline text-2xl font-semibold mb-3 text-primary">Send us a Message</h2>
          <p className="text-muted-foreground">Contact form coming soon!</p>
        </div> */}
      </section>
    </div>
  );
}
