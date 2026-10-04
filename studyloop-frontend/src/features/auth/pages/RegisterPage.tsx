import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, UserPlus, Eye, EyeOff } from 'lucide-react';

import { useAuth } from '../../../app/providers/AuthProvider';

export function RegisterPage() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // دالة التحقق من قوة وشروط كلمة السر
  function validatePassword(pass: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(pass);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');

    // التحقق من الشروط المحددة لكلمة السر
    if (!validatePassword(password)) {
      setError(
        'Use at least 8 characters with uppercase, lowercase, number, and special character.',
      );
      return;
    }

    setIsLoading(true);

    try {
      await register({
        firstName,
        lastName,
        email,
        password,
      });

      navigate('/');
    } catch (error) {
      console.error(error);

      setError(
        'Unable to create your account. Please check your information.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-white">
            <UserPlus size={22} />
          </div>

          <h1 className="text-3xl font-bold">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Start organizing what you learn.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
        >
          {error && (
            <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-medium">
                First name
              </label>

              <input
                required
                value={firstName}
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Last name
              </label>

              <input
                required
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm outline-none focus:border-[var(--primary)]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] pl-4 pr-11 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <p className="mt-2 text-xs text-[var(--muted)]">
              Use at least 8 characters with uppercase,
              lowercase, number, and special character.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {isLoading && (
              <Loader2
                size={17}
                className="animate-spin"
              />
            )}

            {isLoading
              ? 'Creating account...'
              : 'Create account'}
          </button>

          <p className="text-center text-sm text-[var(--muted)]">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="font-medium text-[var(--primary)] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}