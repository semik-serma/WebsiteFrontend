"use client";
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};
const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

export default function RegisterPage() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [debugOtp, setDebugOtp] = useState('');
  const otpInputRefs = useRef([]);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setParticles(Array.from({ length: 25 }, (_, i) => ({
      left: `${(i * 37 + 13) % 100}%`,
      top: `${(i * 53 + 7) % 100}%`,
      delay: i * 0.15,
      size: 2 + (i % 3),
      duration: 3 + (i % 4)
    })));
  }, []);

  const userfirstname = (e) => setFirstname(e.target.value);
  const userlastname = (e) => setLastname(e.target.value);
  const useremail = (e) => setEmail(e.target.value);
  const userpassword = (e) => setPassword(e.target.value);

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const normalizedEmail = email.trim().toLowerCase();
      const response = await axios.post(api.auth.register, { firstname, lastname, email: normalizedEmail, password });

      if (response.status === 200) {
        setEmail(normalizedEmail);
        if (response.data?.data) setDebugOtp(String(response.data.data));
        setShowOtpModal(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5 && otpInputRefs.current[index + 1]) otpInputRefs.current[index + 1].focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpInputRefs.current[index - 1].focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim().replace(/\D/g, '').split('').slice(0, 6);
    if (paste.length > 0) {
      setOtp(prev => { const n = [...prev]; paste.forEach((d, i) => { n[i] = d; }); return n; });
      const next = Math.min(paste.length, 5);
      setTimeout(() => otpInputRefs.current[next]?.focus(), 10);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) { setVerificationError('Please enter the complete 6-digit code'); return; }
    try {
      setIsVerifying(true);
      setVerificationError('');
      const response = await axios.post(api.auth.verifyuser, { email, password, otp: otpValue, firstname, lastname });
      if (response.status === 200) {
        alert('Verification successful! You can now log in.');
        setShowOtpModal(false);
        setFirstname(''); setLastname(''); setEmail(''); setPassword(''); setOtp(['', '', '', '', '', '']);
      }
    } catch (error) {
      setVerificationError(error.response?.data?.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const features = [
    { icon: "M5 13l4 4L19 7", color: "text-purple-400", title: "Free Forever", desc: "No hidden fees or surprise charges" },
    { icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "text-pink-400", title: "Quick Setup", desc: "Get started in less than 2 minutes" },
    { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", color: "text-blue-400", title: "Secure & Private", desc: "Your data is always protected" }
  ];

  return (
    <motion.div initial="initial" animate="animate" className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundImage: "url('/login.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div key={i}
            className="absolute bg-purple-400/50 rounded-full"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="max-w-6xl w-full mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Welcome Section */}
          <motion.div variants={stagger} className="text-white space-y-6 hidden md:block">
            <motion.div variants={fadeUp} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full shadow-2xl"
              >
                <motion.svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </motion.svg>
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-4">
                <motion.h1 variants={fadeUp} className="text-5xl lg:text-6xl font-bold leading-tight">
                  Create Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Account</span>
                </motion.h1>
                <motion.p variants={fadeUp} className="text-xl lg:text-2xl text-white/90 font-light">
                  Join our amazing community today!
                </motion.p>
                <motion.p variants={fadeUp} className="text-lg text-white/80 leading-relaxed">
                  Sign up to get access to exclusive features, personalized content, and connect with others. Your journey starts here.
                </motion.p>
              </motion.div>

              <motion.div variants={stagger} className="space-y-4 pt-6">
                {features.map((f, i) => (
                  <motion.div key={f.title} variants={fadeUp}
                    whileHover={{ x: 6 }}
                    className="flex items-center gap-3 group"
                  >
                    <motion.div
                      initial={{ rotate: 0 }}
                      whileHover={{ rotate: [0, -15, 15, -15, 0] }}
                      transition={{ duration: 0.5 }}
                      className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors"
                    >
                      <svg className={`w-6 h-6 ${f.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                      </svg>
                    </motion.div>
                    <div>
                      <h3 className="text-white font-semibold">{f.title}</h3>
                      <p className="text-white/70 text-sm">{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Side - Register Form */}
          <motion.div variants={fadeUp} className="w-full max-w-md mx-auto md:mx-0">
            <motion.form variants={scaleIn}
              className="register-form bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6 border border-white/10"
              onSubmit={handlesubmit}
            >
              {/* Mobile Header */}
              <motion.div variants={fadeUp} className="text-center space-y-4 md:hidden">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4 shadow-lg"
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </motion.div>
                <h2 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Create Account</h2>
                <p className="text-gray-300 text-sm">Join us today and start your journey</p>
              </motion.div>

              {/* Desktop Header */}
              <motion.div variants={fadeUp} className="text-center space-y-4 hidden md:block">
                <h2 className="text-3xl font-bold text-white mb-2">Sign Up</h2>
                <p className="text-gray-300 text-sm">Create your account to get started</p>
              </motion.div>

              {/* Name Fields */}
              <motion.div variants={stagger} className="grid grid-cols-2 gap-4">
                {['firstname', 'lastname'].map((field) => (
                  <motion.div key={field} variants={fadeUp} className="space-y-2">
                    <label htmlFor={field} className="text-white text-sm font-medium flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {field === 'firstname' ? 'First Name' : 'Last Name'}
                    </label>
                    <input id={field} name={field} type="text" required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder={field === 'firstname' ? 'your name' : 'your lastname'}
                      value={field === 'firstname' ? firstname : lastname}
                      onChange={field === 'firstname' ? userfirstname : userlastname}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Email Field */}
              <motion.div variants={fadeUp} className="space-y-2">
                <label htmlFor="email" className="text-white text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Address
                </label>
                <div className="relative">
                  <input id="email" name="email" type="email" required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="google@gmail.com" value={email} onChange={useremail}
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={fadeUp} className="space-y-2">
                <label htmlFor="password" className="text-white text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Password
                </label>
                <div className="relative">
                  <input id="password" name="password" type={showPassword ? "text" : "password"} required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 pr-12"
                    placeholder="Min. 8 characters" value={password} onChange={userpassword}
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </motion.div>

              {/* Terms */}
              <motion.div variants={fadeUp} className="flex items-start">
                <input id="agree-terms" name="agree-terms" type="checkbox" required defaultChecked={false}
                  className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded bg-white/10 border-white/20"
                  onChange={(e) => { }}
                />
                <label htmlFor="agree-terms" className="ml-2 text-sm text-gray-300">
                  I agree to the{' '}
                  <a href="#" className="text-purple-400 hover:text-purple-300 font-medium">Terms and Conditions</a>
                  {' '}and{' '}
                  <a href="#" className="text-purple-400 hover:text-purple-300 font-medium">Privacy Policy</a>
                </label>
              </motion.div>

              {/* Submit */}
              <motion.button variants={fadeUp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
                onClick={handlesubmit}
              >
                {isLoading ? (
                  <motion.span className="inline-flex items-center gap-2">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    /> Creating...
                  </motion.span>
                ) : 'Create Account'}
              </motion.button>

              {/* Login Link */}
              <motion.div variants={fadeUp} className="text-center text-gray-300 pt-4 border-t border-white/10">
                <span className="text-sm">Already have an account? </span>
                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline">
                  Sign In
                </Link>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </div>

      {/* OTP Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-black/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6 border border-white/10 max-w-md w-full"
            >
              <div className="text-center">
                <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-white mb-2">Verify Your Email</motion.h2>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                  className="text-gray-300 text-sm">Enter the 6-digit code we sent to {email}</motion.p>
                {debugOtp && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className="text-yellow-400 text-xs mt-1">Debug: OTP is <span className="font-mono font-bold text-yellow-300">{debugOtp}</span></motion.p>
                )}
              </div>

              <form onSubmit={handleVerifySubmit} className="space-y-6">
                <motion.div initial="hidden" animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                  className="space-y-2"
                >
                  <label className="text-white text-sm font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Verification Code
                  </label>
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                      <motion.input key={index}
                        variants={{ hidden: { opacity: 0, scale: 0.5, y: 20 }, visible: { opacity: 1, scale: 1, y: 0 } }}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        type="text" inputMode="numeric" maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-14 h-16 text-center text-2xl font-bold bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      />
                    ))}
                  </div>
                </motion.div>

                <AnimatePresence>
                  {verificationError && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                      className="rounded-xl bg-red-500/20 border border-red-500/30 p-4 backdrop-blur-sm"
                    >
                      <p className="text-sm text-red-200">{verificationError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3">
                  <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all"
                    onClick={() => setShowOtpModal(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
                    disabled={isVerifying || otp.some(d => d === '')}
                  >
                    {isVerifying ? 'Verifying...' : 'Verify Account'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}