import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input, Label, FieldError } from '../components/ui/FormField';
import { Button } from '../components/ui/Button';
import { AuthLayout } from './LoginPage';

export default function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = 'Full name is required.';
    if (!email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Password is required.';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters.';
    if (confirmPassword !== password) next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { error } = await signUp(email, password, fullName.trim());
    setLoading(false);
    if (error) {
      setErrors({ form: error });
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <AuthLayout>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Check your email</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          We've sent a confirmation link to <strong>{email}</strong>. Confirm your address, then log in.
        </p>
        <Button className="mt-6 w-full" onClick={() => navigate('/login')}>
          Go to login
        </Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Create your account</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Start organizing your work with AI.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <FieldError message={errors.fullName} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <FieldError message={errors.email} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <FieldError message={errors.password} />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FieldError message={errors.confirmPassword} />
        </div>
        <FieldError message={errors.form} />
        <Button type="submit" className="w-full" loading={loading}>
          Sign up
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
