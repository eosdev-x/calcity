import { SignupForm } from '../../components/auth/SignupForm';

export function Signup() {
  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="container mx-auto px-4">
        <SignupForm />
      </div>
    </div>
  );
}
