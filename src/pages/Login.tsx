/**
 * Login Page
 *
 * A centered login form using the Kvalt design system components.
 * Includes email/password fields, remember-me checkbox, and sign-in button.
 */

import { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Checkbox } from '../components/Checkbox';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-6"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 w-full max-w-[400px]"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1
            className="font-display text-headline-l font-bold"
            style={{ color: 'var(--color-on-surface)' }}
          >
            Welcome back
          </h1>
          <p
            className="font-sans text-base font-medium"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            Sign in to your account to continue
          </p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={showPassword ? EyeOff : Eye}
            onIconClick={() => setShowPassword(!showPassword)}
            autoComplete="current-password"
          />
        </div>

        {/* Remember me & forgot password */}
        <div className="flex items-center justify-between">
          <Checkbox
            size="sm"
            label="Remember me"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <button
            type="button"
            className="font-sans text-md font-bold cursor-pointer bg-transparent border-none transition-colors duration-150"
            style={{ color: 'var(--color-on-secondary-1)' }}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit */}
        <Button type="submit" iconLeft={LogIn} className="w-full">
          Sign in
        </Button>

        {/* Sign up link */}
        <p
          className="font-sans text-md font-medium text-center"
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          Don't have an account?{' '}
          <button
            type="button"
            className="font-bold cursor-pointer bg-transparent border-none transition-colors duration-150"
            style={{ color: 'var(--color-on-secondary-1)' }}
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}
