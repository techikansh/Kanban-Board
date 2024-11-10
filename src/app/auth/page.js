"use client";
import { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8 px-4 mt-56">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {isLogin ? 'Login' : 'Register'}
          </h1>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? 'Hast du kein Konto? Register' : 'Du hast ein Konto? Login'}
          </button>
        </div>
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
} 