"use client";
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center max-w-7xl mx-auto px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-2xl">Project Flow</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-9 px-4"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
} 