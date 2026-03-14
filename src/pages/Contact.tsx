import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { siteConfig } from '../config/site';
import { Turnstile } from '../components/Turnstile';

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [companyUrl, setCompanyUrl] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          company_url: companyUrl,
          turnstileToken,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to send message. Please try again.');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setCompanyUrl('');
      setTurnstileToken('');
      setTurnstileResetKey((prev) => prev + 1);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-surface py-12">
      <SEO
        title={siteConfig.seo.pages.contactTitle}
        description={siteConfig.seo.pages.contactDescription}
        path="/contact"
      />
      <div className="container mx-auto px-4">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-surface-container-low rounded-xl shadow-sm p-4 sm:p-8 border border-outline-variant overflow-hidden break-words">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-on-surface">Contact Us</h1>
              <p className="text-on-surface-variant mt-2">
                Have a question or need help? Send us a message and we will get back to you.
              </p>
            </div>

            {status === 'success' && (
              <div className="mb-4 p-3 bg-primary-container border border-primary rounded-xl flex items-start">
                <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-on-primary-container text-sm">
                  Thanks for reaching out. Your message has been sent.
                </span>
              </div>
            )}

            {status === 'error' && error && (
              <div className="mb-4 p-3 bg-error-container border border-error rounded-xl flex items-start">
                <AlertCircle className="w-5 h-5 text-error mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-on-error-container text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 min-w-0">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-on-surface-variant mb-1">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full max-w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary px-3 py-2"
                  placeholder="Jane Doe"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-on-surface-variant mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full max-w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary px-3 py-2"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-on-surface-variant mb-1">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full max-w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary px-3 py-2"
                  placeholder="How can we help?"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-on-surface-variant mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full max-w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary px-3 py-2"
                  placeholder="Tell us more about what you need..."
                  required
                />
              </div>

              <div
                className="absolute left-[-10000px] top-auto h-0 w-0 overflow-hidden opacity-0"
                aria-hidden="true"
              >
                <label htmlFor="company_url">Company Website</label>
                <input
                  id="company_url"
                  name="company_url"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.target.value)}
                />
              </div>

              <Turnstile
                onVerify={setTurnstileToken}
                onExpire={() => setTurnstileToken('')}
                resetKey={turnstileResetKey}
              />

              <button
                type="submit"
                disabled={status === 'submitting' || !turnstileToken}
                className="w-full btn-primary flex justify-center items-center"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
