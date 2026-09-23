import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input, Label, FieldError } from '../components/ui/FormField';
import { Button } from '../components/ui/Button';
import { AuthLayout } from './LoginPage';

export function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Enter your email address.');
      return;
    }
    setLoading(true);
    const { error: err } = await requestPasswordReset(email);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setSent(true);
  }

  return (
    <AuthLayout>
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Reset your password</h1>
      {sent ? (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          If an account exists for <strong>{email}</strong>, a reset link is on its way.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <FieldError message={error} />
          </div>
          <Button type="submit" className="w-full" loading={loading}>
            Send reset link
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <Link to="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}

export function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error: err } = await updatePassword(password);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    navigate('/dashboard');
  }

  return (
    <AuthLayout>
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Choose a new password</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <FieldError message={error} />
        <Button type="submit" className="w-full" loading={loading}>
          Update password
        </Button>
      </form>
    </AuthLayout>
  );
}
