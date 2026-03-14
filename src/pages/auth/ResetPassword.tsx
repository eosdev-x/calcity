import { ResetPasswordForm } from '../../components/auth/ResetPasswordForm';
import { SEO } from '../../components/SEO';
import { siteConfig } from '../../config/site';

export function ResetPassword() {
  return (
    <div className="min-h-screen bg-surface py-12">
      <SEO
        title={siteConfig.seo.pages.resetPasswordTitle}
        path="/auth/reset-password"
        noindex
      />
      <div className="container mx-auto px-4">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
