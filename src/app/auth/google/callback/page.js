'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const processGoogleAuth = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setErrorMessage(
          error === 'access_denied'
            ? 'Sign-in request was cancelled or denied.'
            : `Google sign-in error: ${error}`
        );
        return;
      }

      if (!code) {
        setStatus('error');
        setErrorMessage('No authorization code was provided by Google.');
        return;
      }

      try {
        const redirectUri = `${window.location.origin}/auth/google/callback`;
        const response = await axios.post(api.auth.googleCallback, {
          code,
          redirectUri,
        });

        const token = response.data?.data?.token;
        const user = response.data?.data?.data;

        if (!token) {
          throw new Error('No authentication token returned by the server.');
        }

        // Store auth tokens & user info
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user || {}));
        localStorage.setItem('isLoggedIn', 'true');
        document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

        // Notify other components (Navbar, etc.)
        window.dispatchEvent(new Event('storage'));

        setStatus('success');

        // Smooth redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1200);
      } catch (err) {
        console.error('Google callback error:', err);
        setStatus('error');
        setErrorMessage(
          err.response?.data?.message ||
          err.message ||
          'Failed to complete Google authentication. Please try again.'
        );
      }
    };

    processGoogleAuth();
  }, [searchParams, router]);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundImage: "url('/login.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />

      {/* Background ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10 bg-black/40 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/10 text-center space-y-6"
      >
        {status === 'processing' && (
          <div className="space-y-6 py-4">
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              {/* Outer rotating ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />
              {/* Google G Logo inside */}
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.36 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Authenticating with Google
              </h2>
              <p className="text-gray-300 text-sm">
                Securing your session, please wait a moment...
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 py-4"
          >
            <div className="w-16 h-16 mx-auto bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center text-green-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Login Successful!</h2>
              <p className="text-gray-300 text-sm">Redirecting to your dashboard...</p>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 py-2"
          >
            <div className="w-16 h-16 mx-auto bg-red-500/20 border border-red-500/40 rounded-full flex items-center justify-center text-red-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Sign-in Failed</h2>
              <p className="text-red-200 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                {errorMessage}
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-3">
              <Link
                href="/login"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 inline-block"
              >
                Back to Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
          <p>Loading...</p>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
