"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = async (email, password) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      router.push('/');
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      // After registration, log in automatically
      await login(email, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push('/auth');
  };

  return (
    <AuthContext.Provider value={{
      user: session?.user,
      login,
      register,
      logout,
      loading: status === 'loading'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);