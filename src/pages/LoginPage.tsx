import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Input, Label, FieldError } from '../components/ui/FormField';
import { Button } from '../components/ui/Button';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    const { error: signInError } = await signIn(email, password);
    setLoading(false);
    if (signInError) {
      setError(signInError);
      return;
    }
    navigate('/dashboard');
  }

  return (
    <AuthLayout>
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Welcome back</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Log in to keep your tasks moving.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="mb-1.5 text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <FieldError message={error} />
        <Button type="submit" className="w-full" loading={loading}>
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">TaskFlow AI</span>
        </div>
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-card">
          {children}
        </div>
      </div>
    </div>
  );
}
