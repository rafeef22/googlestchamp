import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const success = await auth.login(email, password);
        if (success) {
          navigate('/admin', { replace: true });
        } else {
          // The API service would throw an error on failure which is caught below
          setError('Invalid email or password.');
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-brand-surface rounded-2xl shadow-lg border border-brand-border">
        <div>
          <h1 className="text-3xl font-bold text-center text-brand-primary tracking-wider">
            CHAMP
          </h1>
          <h2 className="mt-2 text-xl font-semibold text-center text-brand-secondary">
            Admin Panel
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-4 py-3 text-base border border-brand-border rounded-md placeholder-brand-secondary text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password"className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-4 py-3 text-base border border-brand-border rounded-md placeholder-brand-secondary text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {error && <p className="text-sm text-center text-red-500 font-medium">{error}</p>}

          <div className="pt-2">
            <Button type="submit" variant="secondary" isLoading={isLoading} className="w-full py-3.5">
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;