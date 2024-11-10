"use client";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import Header from "@/components/Header";
import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

function AuthRedirect() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth');
    }
  }, [status, router]);

  return null; // This component does not render anything
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <AuthProvider>
            <AuthRedirect />
            <Header />
            {children}
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
