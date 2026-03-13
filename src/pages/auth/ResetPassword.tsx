import { ResetPasswordForm } from '../../components/auth/ResetPasswordForm';

export function ResetPassword() {
  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="container mx-auto px-4">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
