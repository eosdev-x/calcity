import { LoginForm } from '../../components/auth/LoginForm';
import { SEO } from '../../components/SEO';
import { siteConfig } from '../../config/site';

export function Login() {
  return (
    <div className="min-h-screen bg-surface py-12">
      <SEO
        title={siteConfig.seo.pages.loginTitle}
        path="/auth/login"
        noindex
      />
      <div className="container mx-auto px-4">
        <LoginForm />
      </div>
    </div>
  );
}
