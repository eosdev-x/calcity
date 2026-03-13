import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm';
import { SEO } from '../../components/SEO';
import { siteConfig } from '../../config/site';

export function ForgotPassword() {
  return (
    <div className="min-h-screen bg-surface py-12">
      <SEO
        title={siteConfig.seo.pages.forgotPasswordTitle}
        path="/auth/forgot-password"
        noindex
      />
      <div className="container mx-auto px-4">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
