"use client";
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#fafafa] px-4 mt-10">
      <div className="w-full max-w-[400px] space-y-6">
        {/* <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground text-gray-500">
            Enter your details below to create your account
          </p>
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-200"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-200"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2 w-full"
          >
            Create account
          </button>
        </form>

      </div>
    </div>
  );
} 