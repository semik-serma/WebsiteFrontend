'use client';

import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from "framer-motion";

export default function LoginPage() {
const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("isLoggedIn");
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(api.auth.login, {
      email,
      password,
    });

    const token = response.data.data.token;
    const user = response.data.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");
    document.cookie = `token=${token}; path=/`;

    router.push("/dashboard");
  } catch (error) {
    alert(error.response?.data?.message || "Login failed");
  }
};

  return (
    <>

      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ backgroundImage: "url('/login.png')" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>

        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => {
            const left = ((i * 37 + 13) % 100);
            const top = ((i * 53 + 7) % 100);
            const dur = 3 + ((i * 7) % 4);
            const del = ((i * 13) % 30) / 10;
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                style={{ left: `${left}%`, top: `${top}%` }}
                animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: dur, repeat: Infinity, delay: del }}
              />
            );
          })}
        </div>

        <div className="max-w-6xl w-full mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">

            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-white space-y-6 hidden md:block"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl"
                >
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                    Welcome <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Back</span>
                  </h1>
                  <p className="text-xl lg:text-2xl text-white/90 font-light">
                    We&apos;re so excited to see you again!
                  </p>
                  <p className="text-lg text-white/80 leading-relaxed">
                    Log in to access your personalized dashboard, manage your account, and continue where you left off. Your journey continues here.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4 pt-6"
                >
                  {[
                    { icon: "M5 13l4 4L19 7", color: "text-blue-400", title: "Secure Access", desc: "Your data is protected with enterprise-grade security" },
                    { icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "text-purple-400", title: "Fast Performance", desc: "Lightning quick access to your account" },
                    { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", color: "text-pink-400", title: "User Friendly", desc: "Intuitive interface designed for you" }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.15 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <svg className={`w-6 h-6 ${item.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{item.title}</h3>
                        <p className="text-white/70 text-sm">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="w-full max-w-md mx-auto md:mx-0"
            >
              <motion.form
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6 border border-white/10"
                onSubmit={handleSubmit}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center space-y-4 md:hidden"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg"
                  >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </motion.div>
                  <h2 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Welcome Back
                  </h2>
                  <p className="text-gray-300 text-sm">Enter your credentials to access your account</p>
                </motion.div>

                <div className="text-center space-y-4 hidden md:block">
                  <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
                  <p className="text-gray-300 text-sm">Enter your credentials to continue</p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <label htmlFor="email" className="text-white text-sm font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2"
                >
                  <label htmlFor="password" className="text-white text-sm font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 pr-12"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      onClick={(e) => { }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      defaultChecked={false}
                      onChange={(e) => { }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white/10 border-white/20"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                      Forgot Password?
                    </Link>
                  </div>
                </motion.div>

                <div className="rounded-xl bg-red-500/20 border border-red-500/30 p-4 backdrop-blur-sm hidden">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-200">Sample error message</p>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
                >
                  Sign In
                </motion.button>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-center text-gray-300 pt-4 border-t border-white/10"
                >
                  <span className="text-sm">New to our platform? </span>
                  <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline">
                    Create an account
                  </Link>
                </motion.div>

              </motion.form>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
}
