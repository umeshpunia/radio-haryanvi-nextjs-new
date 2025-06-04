
import { Metadata } from 'next';
import { ShieldCheckIcon } from 'lucide-react'; // Or any appropriate icon

export const metadata: Metadata = {
  title: 'Privacy Policy - Radio Haryanvi',
  description: 'Read the privacy policy for Radio Haryanvi.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-12 text-center">
        <ShieldCheckIcon className="w-24 h-24 text-primary mx-auto mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
          Privacy Policy
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <section className="space-y-6 text-muted-foreground leading-relaxed prose dark:prose-invert prose-headings:text-primary prose-a:text-primary">
        <p>
          Radio Haryanvi ("us", "we", or "our") operates the Radio Haryanvi website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
        </p>

        <h2 className="font-headline text-2xl font-semibold text-primary">Information Collection and Use</h2>
        <p>
          We collect several different types of information for various purposes to provide and improve our Service to you.
        </p>

        <h3 className="font-headline text-xl font-semibold">Types of Data Collected</h3>
        
        <h4>Personal Data</h4>
        <p>
          While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>Email address (if you subscribe to a newsletter or contact us)</li>
          <li>Cookies and Usage Data</li>
        </ul>

        <h4>Usage Data</h4>
        <p>
          We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
        </p>

        <h4>Tracking & Cookies Data</h4>
        <p>
          We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
        </p>

        <h2 className="font-headline text-2xl font-semibold text-primary">Use of Data</h2>
        <p>Radio Haryanvi uses the collected data for various purposes:</p>
        <ul className="list-disc list-inside ml-4">
          <li>To provide and maintain the Service</li>
          <li>To notify you about changes to our Service</li>
          <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
          <li>To provide customer care and support</li>
          <li>To provide analysis or valuable information so that we can improve the Service</li>
          <li>To monitor the usage of the Service</li>
          <li>To detect, prevent and address technical issues</li>
        </ul>

        <h2 className="font-headline text-2xl font-semibold text-primary">Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "last updated" date at the top of this Privacy Policy.
        </p>

        <h2 className="font-headline text-2xl font-semibold text-primary">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us by visiting the contact page on our website.
        </p>
      </section>
    </div>
  );
}
