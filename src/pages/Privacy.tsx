import { Link } from 'react-router-dom';
import { siteConfig } from '../config/site';
import { SEO } from '../components/SEO';

export function Privacy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <SEO
        title={siteConfig.seo.pages.privacyTitle}
        path="/privacy"
        noindex
      />
      <h1 className="text-3xl font-bold mb-8 text-on-surface">Privacy Policy</h1>

      <div className="prose max-w-none prose-headings:text-on-surface prose-p:text-on-surface-variant prose-li:text-on-surface-variant prose-strong:text-on-surface">
        <p className="text-lg mb-6">
          Last Updated: March 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant">1. Overview</h2>
          <p>
            This Privacy Policy explains how {siteConfig.name} collects, uses, and protects information when you
            visit {siteConfig.domain} and use our community services for {siteConfig.city}, {siteConfig.state}.
            By using the Service, you agree to the practices described here.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant">2. Information We Collect</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Account details such as name, username, and login credentials you provide.</li>
            <li>Profile and submission content including business listings, events, reviews, and comments.</li>
            <li>Usage data such as pages viewed, interactions, and device or browser information.</li>
            <li>Payment-related data for subscriptions, processed by Stripe (we do not store full card details).</li>
            <li>Location data you choose to share to improve local results and recommendations.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant">3. How We Use Information</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Provide, operate, and improve the Service and community features.</li>
            <li>Publish and manage listings, events, and other user-generated content.</li>
            <li>Process subscriptions and support billing through Stripe.</li>
            <li>Communicate important updates, policy changes, or service notices.</li>
            <li>Protect against fraud, abuse, and security incidents.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant">4. Cookies and Similar Technologies</h2>
          <p>
            We use cookies and similar technologies to keep you signed in, remember preferences, and analyze how
            the Service is used. You can control cookies through your browser settings, but some features may not
            function properly if cookies are disabled.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant">5. Third-Party Services</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Supabase provides authentication, database, and file storage infrastructure.</li>
            <li>Stripe processes subscription payments and handles billing details.</li>
            <li>Google OAuth may be used to let you sign in with your Google account.</li>
          </ul>
          <p>
            These providers process information under their own privacy policies. We only share the minimum data
            needed for them to deliver their services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant">6. Data Retention</h2>
          <p>
            We retain information for as long as needed to provide the Service, comply with legal obligations, resolve
            disputes, and enforce our agreements. You may request deletion of your account and content, subject to
            legal or operational retention requirements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant">7. Your Rights (California Privacy Rights)</h2>
          <p>
            If you are a California resident, you may have rights under the CCPA, including the right to know, access,
            correct, delete, and opt out of the sale or sharing of personal information. {siteConfig.name} does not sell
            personal information as defined by the CCPA. You can submit requests using our contact form.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant">8. Security</h2>
          <p>
            We use reasonable administrative, technical, and physical safeguards to protect your information. However,
            no method of transmission or storage is completely secure, so we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant">9. Contact Us</h2>
          <p>
            For privacy questions or requests, please use the contact form at{' '}
            <Link to="/contact" className="text-on-surface-variant hover:text-primary underline transition-colors duration-[var(--md-sys-motion-duration-short3)]">/contact</Link>.
          </p>
          <div className="mt-4">
            <p>{siteConfig.name} Legal Department</p>
            <p>
              Address: {siteConfig.legal.address}, {siteConfig.city}, {siteConfig.state} {siteConfig.legal.zipCode}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Privacy;
