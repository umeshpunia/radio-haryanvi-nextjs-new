
import { Metadata } from 'next';
import { ShieldCheckIcon } from 'lucide-react'; // Or any appropriate icon
import Link from 'next/link'; // Added missing import

export const metadata: Metadata = {
  title: 'Privacy Policy - Radio Haryanvi',
  description: 'Read the privacy policy for Radio Haryanvi, detailing how we collect, use, and protect your data, including information related to Google AdSense advertising.',
};

export default function PrivacyPolicyPage() {
  const lastUpdatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-12 text-center">
        <ShieldCheckIcon className="w-24 h-24 text-primary mx-auto mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
          Privacy Policy
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Last updated: {lastUpdatedDate}
        </p>
      </header>

      <section className="space-y-6 text-muted-foreground leading-relaxed prose dark:prose-invert prose-headings:text-primary prose-a:text-primary">
        <p>
          Radio Haryanvi ("us", "we", or "our") operates the Radio Haryanvi website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. We value your privacy and are committed to protecting it.
        </p>

        <h2 className="font-headline text-2xl font-semibold text-primary">Information Collection and Use</h2>
        <p>
          We collect several different types of information for various purposes to provide and improve our Service to you, and to display relevant advertisements.
        </p>

        <h3 className="font-headline text-xl font-semibold">Types of Data Collected</h3>
        
        <h4>Personal Data</h4>
        <p>
          While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>Email address (if you subscribe to a newsletter, contact us, or create an account)</li>
          <li>Name (if you provide it, e.g., in a contact form or user profile)</li>
          <li>Usage Data and Cookies (see below)</li>
        </ul>

        <h4>Usage Data</h4>
        <p>
          We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
        </p>

        <h4>Tracking & Cookies Data</h4>
        <p>
          We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device.
        </p>
        <p>
          You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
        </p>
        <p>Examples of Cookies we use:</p>
        <ul className="list-disc list-inside ml-4">
          <li><strong>Session Cookies:</strong> We use Session Cookies to operate our Service.</li>
          <li><strong>Preference Cookies:</strong> We use Preference Cookies to remember your preferences and various settings.</li>
          <li><strong>Security Cookies:</strong> We use Security Cookies for security purposes.</li>
          <li><strong>Advertising Cookies:</strong> Advertising Cookies are used to serve you with advertisements that may be relevant to you and your interests.</li>
        </ul>

        <h2 className="font-headline text-2xl font-semibold text-primary">Advertising and Google AdSense</h2>
        <p>
          We use Google AdSense to display advertisements on our Service. Google AdSense is an advertising service provided by Google Inc.
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website or other websites.</li>
          <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our Service and/or other sites on the Internet.</li>
          <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ad Settings</a>.</li>
          <li>Alternatively, users can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info/choices</a> or <a href="https://youronlinechoices.eu/" target="_blank" rel="noopener noreferrer">youronlinechoices.eu</a>.</li>
        </ul>
        <p>
          If you have not <a href="https://support.google.com/adsense/answer/1348695?hl=en" target="_blank" rel="noopener noreferrer">opted out of third-party ad serving</a>, the cookies of other <a href="https://support.google.com/adsense/answer/9012903" target="_blank" rel="noopener noreferrer">third-party vendors or ad networks</a> may also be used to serve ads on your site, which should also be disclosed in your privacy policy in the following manner:
        </p>
        <ul className="list-disc list-inside ml-4">
            <li>Notify your site visitors of the third-party vendors and ad networks serving ads on your site.</li>
            <li>Provide links to the appropriate vendor and ad network websites.</li>
            <li>Inform users that they may visit those websites to opt out of the use of cookies for personalized advertising (if the vendor or ad network offers this capability). Alternatively, you can direct users to opt out of some third-party vendors’ uses of cookies for personalized advertising by visiting <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info/choices</a>.</li>
        </ul>
        <p>
          Because publisher sites and laws across countries vary, we're unable to suggest specific privacy policy language. However, you may wish to review resources such as the <a href="https://www.networkadvertising.org/" target="_blank" rel="noopener noreferrer">Network Advertising Initiative</a> for guidance on drafting a privacy policy. For additional details regarding cookie consent notices, please refer to <a href="https://www.cookiechoices.org/" target="_blank" rel="noopener noreferrer">cookiechoices.org</a>.
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
          <li>To serve personalized advertisements (as detailed above)</li>
        </ul>

        <h2 className="font-headline text-2xl font-semibold text-primary">Data Retention</h2>
        <p>
          We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
        </p>
        <p>
          Usage Data is generally retained for a shorter period, except when this data is used to strengthen the security or to improve the functionality of our Service, or we are legally obligated to retain this data for longer time periods.
        </p>

        <h2 className="font-headline text-2xl font-semibold text-primary">Data Transfer</h2>
        <p>
          Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those from your jurisdiction.
        </p>
        <p>
          If you are located outside India and choose to provide information to us, please note that we transfer the data, including Personal Data, to India and process it there.
        </p>
        <p>
          Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.
        </p>
        <p>
          Radio Haryanvi will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of your data and other personal information.
        </p>

        <h2 className="font-headline text-2xl font-semibold text-primary">Disclosure of Data</h2>
        <h3 className="font-headline text-xl font-semibold">Legal Requirements</h3>
        <p>
          Radio Haryanvi may disclose your Personal Data in the good faith belief that such action is necessary to:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>To comply with a legal obligation</li>
          <li>To protect and defend the rights or property of Radio Haryanvi</li>
          <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
          <li>To protect the personal safety of users of the Service or the public</li>
          <li>To protect against legal liability</li>
        </ul>

        <h2 className="font-headline text-2xl font-semibold text-primary">Security of Data</h2>
        <p>
          The security of your data is important to us but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
        </p>

        <h2 className="font-headline text-2xl font-semibold text-primary">Links to Other Sites</h2>
        <p>
          Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third-party sites or services.
        </p>

        <h2 className="font-headline text-2xl font-semibold text-primary">Children's Privacy</h2>
        <p>
          Our Service does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.
        </p>
        
        <h2 className="font-headline text-2xl font-semibold text-primary">Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "last updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
        </p>

        <h2 className="font-headline text-2xl font-semibold text-primary">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us by visiting the <Link href="/contact">contact page</Link> on our website.
        </p>
      </section>
    </div>
  );
}

