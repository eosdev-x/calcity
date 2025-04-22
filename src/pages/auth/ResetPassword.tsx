import { ResetPasswordForm } from '../../components/auth/ResetPasswordForm';

export function ResetPassword() {
  return (
    <div className="min-h-screen bg-desert-50 dark:bg-night-desert-50 py-12">
      <div className="container mx-auto px-4">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
