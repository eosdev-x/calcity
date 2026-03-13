import { Link } from 'react-router-dom';
import { siteConfig } from '../config/site';

export function Terms() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-on-surface">Terms of Service</h1>
      
      <div className="prose max-w-none prose-headings:text-on-surface prose-p:text-on-surface-variant prose-li:text-on-surface-variant prose-strong:text-on-surface">
        <p className="text-lg mb-6">
          Last Updated: April 23, 2025
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant">1. Introduction</h2>
          <p>
            Welcome to {siteConfig.name}. These Terms of Service ("Terms") govern your access to and use of the {siteConfig.name} website
            and all related services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms.
            If you do not agree to these Terms, please do not use the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant">2. User Rights and Responsibilities</h2>
          <p>
            When using our Service, you have the right to access information about {siteConfig.city} and its businesses and events.
            In return, you are responsible for:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Providing accurate information when creating an account or submitting content</li>
            <li>Maintaining the security of your account credentials</li>
            <li>Using the Service in a manner consistent with applicable laws and regulations</li>
            <li>Respecting the rights of other users and third parties</li>
            <li>Reporting any security vulnerabilities or misuse of the Service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant">3. Website Usage Guidelines</h2>
          <p>
            To ensure a positive experience for all users, we ask that you:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Use the Service for its intended purpose of finding information about {siteConfig.city}</li>
            <li>Do not attempt to disrupt or interfere with the Service's operation</li>
            <li>Do not use automated systems or software to extract data from the Service (scraping) without our prior written consent</li>
            <li>Do not bypass any measures we may use to prevent or restrict access to the Service</li>
            <li>Do not impose an unreasonable load on our infrastructure</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant">4. Content Policies and Restrictions</h2>
          <p>
            Our Service allows users to submit content, including business listings, event information, reviews, and comments.
            You retain ownership of your content, but grant us a license to use, store, and display it in connection with the Service.
            The following types of content are prohibited:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
            <li>Content that infringes on intellectual property rights</li>
            <li>Content that contains false or misleading information</li>
            <li>Spam, unsolicited advertisements, or promotional materials</li>
            <li>Content that contains malware, viruses, or other harmful code</li>
            <li>Content that violates the privacy or publicity rights of others</li>
          </ul>
          <p>
            We reserve the right to remove any content that violates these policies and to terminate access for users who repeatedly violate them.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant">5. User Account Rules</h2>
          <p>
            To access certain features of the Service, you may need to create an account. When you do:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>You must provide accurate and complete information</li>
            <li>You are responsible for all activities that occur under your account</li>
            <li>You must notify us immediately of any unauthorized use of your account</li>
            <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
            <li>You may not create multiple accounts or transfer your account to another person</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant">6. Privacy Policy</h2>
          <p>
            Our <Link to="/privacy" className="text-on-surface-variant hover:text-primary underline transition-colors duration-[var(--md-sys-motion-duration-short3)]">Privacy Policy</Link> describes 
            how we collect, use, and share information about you when you use our Service. By using the Service, you agree to our collection, 
            use, and sharing of information as described in the Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant">7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>The Service is provided "as is" and "as available" without warranties of any kind</li>
            <li>We disclaim all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
            <li>We are not liable for any indirect, incidental, special, consequential, or punitive damages</li>
            <li>Our total liability for any claims arising from or related to the Service is limited to the greater of $100 or the amount you paid us in the past 12 months</li>
          </ul>
          <p>
            Some jurisdictions do not allow the exclusion of certain warranties or the limitation of liability for certain types of damages, so some of the above limitations may not apply to you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant">8. Dispute Resolution</h2>
          <p>
            If you have a dispute with us, please contact us first and try to resolve the dispute informally. If we cannot resolve the dispute informally:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Any dispute arising from or relating to these Terms or the Service will be resolved through binding arbitration</li>
            <li>The arbitration will be conducted by the American Arbitration Association under its Consumer Arbitration Rules</li>
            <li>The arbitration will take place in {siteConfig.legal.arbitrationLocation}</li>
            <li>Each party will be responsible for its own costs and fees</li>
            <li>You may opt out of this arbitration agreement by notifying us in writing within 30 days of first accepting these Terms</li>
          </ul>
          <p>
            This arbitration agreement does not preclude you from bringing issues to the attention of federal, state, or local agencies, or from seeking small claims court relief for disputes within the jurisdiction of the small claims court.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant ">9. Data Collection and Usage</h2>
          <p>
            We collect and process data as described in our Privacy Policy. Additionally:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts</li>
            <li>We may collect location data to provide location-based services</li>
            <li>We may use third-party services to process payments, analyze data, and provide other services</li>
            <li>We implement reasonable security measures to protect your data, but cannot guarantee absolute security</li>
            <li>You have the right to access, correct, and delete your personal data, subject to certain limitations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant ">10. Intellectual Property Rights</h2>
          <p>
            The Service and its original content, features, and functionality are owned by {siteConfig.name} and are protected by copyright, trademark, and other intellectual property laws:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>The {siteConfig.name} name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of {siteConfig.name} or its affiliates</li>
            <li>You may not use these marks without our prior written permission</li>
            <li>You retain ownership of content you submit, but grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute it</li>
            <li>You represent that you have all necessary rights to grant us this license</li>
            <li>You are responsible for ensuring that your content does not infringe on the rights of others</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant ">11. Termination</h2>
          <p>
            We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Violation of these Terms</li>
            <li>At our sole discretion, for any reason</li>
            <li>At your request</li>
            <li>Due to extended periods of inactivity</li>
            <li>If required by law</li>
          </ul>
          <p>
            Upon termination, your right to use the Service will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant ">12. Amendments and Updates</h2>
          <p>
            We may update these Terms from time to time:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>We will notify you of significant changes by posting a notice on the Service or sending you an email</li>
            <li>Your continued use of the Service after changes become effective constitutes acceptance of the updated Terms</li>
            <li>The date at the top of these Terms indicates when they were last updated</li>
            <li>We encourage you to review these Terms periodically</li>
            <li>If you do not agree to the updated Terms, you must stop using the Service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant ">13. Governing Law and Jurisdiction</h2>
          <p>
            These Terms and your use of the Service shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
          </p>
          <p>
            Any legal action or proceeding arising out of or relating to these Terms or the Service shall be brought exclusively in the federal or state courts located in {siteConfig.city}, {siteConfig.state}, and you consent to the personal jurisdiction of such courts.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-on-surface-variant ">14. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <div className="mt-4">
            <p>{siteConfig.name} Legal Department</p>
            <p>Email: <a href={`mailto:legal@${siteConfig.domain}`} className="text-on-surface-variant hover:underline">legal@{siteConfig.domain}</a></p>
            {siteConfig.contact.phone && (
              <p>Phone: {siteConfig.contact.phone}</p>
            )}
            <p>
              Address: {siteConfig.legal.address}, {siteConfig.city}, {siteConfig.state} {siteConfig.legal.zipCode}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Terms;
