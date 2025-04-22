import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm';

export function ForgotPassword() {
  return (
    <div className="min-h-screen bg-desert-50 dark:bg-night-desert-50 py-12">
      <div className="container mx-auto px-4">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
