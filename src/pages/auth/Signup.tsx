import { SignupForm } from '../../components/auth/SignupForm';
import { SEO } from '../../components/SEO';
import { siteConfig } from '../../config/site';

export function Signup() {
  return (
    <div className="min-h-screen bg-surface py-12">
      <SEO
        title={siteConfig.seo.pages.signupTitle}
        path="/auth/signup"
        noindex
      />
      <div className="container mx-auto px-4">
        <SignupForm />
      </div>
    </div>
  );
}
