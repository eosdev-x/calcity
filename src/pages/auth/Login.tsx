import { LoginForm } from '../../components/auth/LoginForm';

export function Login() {
  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="container mx-auto px-4">
        <LoginForm />
      </div>
    </div>
  );
}
