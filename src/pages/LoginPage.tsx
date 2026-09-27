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
      <h1 className="font-display text-xl font-semibold text-gray-900 dark:text-gray-100">Welcome back</h1>
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper dark:bg-ink-900 px-4 py-10">
      {/* Signature glowing orb, echoing the reference hero screens */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/3 rounded-full bg-orb-gradient opacity-0 blur-3xl dark:opacity-40"
      />

      <div className="relative w-full max-w-sm animate-fade-in">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orb-gradient text-ink-900 shadow-glow-lg dark:shadow-glow-lg">
            <Sparkles className="h-7 w-7" />
          </div>
          <span className="font-display text-xl font-semibold text-gray-900 dark:text-gray-100">TaskFlow AI</span>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">AI-powered task tracking</p>
        </div>
        <div className="rounded-3xl border border-gray-100 dark:border-white/10 bg-paper-card dark:bg-white/[0.04] dark:backdrop-blur-xl p-6 shadow-card">
          {children}
        </div>
      </div>
    </div>
  );
}
