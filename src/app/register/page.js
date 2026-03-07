"use client";
import Link from 'next/link';
import { useState, useRef } from 'react';
import axios from 'axios';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const otpInputRefs = useRef([]);

  const userfirstname = (event) => {
    console.log(event.target.value)
    setFirstname(event.target.value)
  }
  const userlastname = (event) => {
    console.log(event.target.value)
    setLastname(event.target.value)
  }
  const useremail = (event) => {
    console.log(event.target.value)
    setEmail(event.target.value)
  }
  const userpassword = (event) => {
    console.log(event.target.value)
    setPassword(event.target.value)
  }

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data = { firstname, lastname, email, password };
      const response = await axios.post(api.auth.register, data);

      if (response.status === 200) {
        // Show OTP modal after successful registration
        setShowOtpModal(true);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered and not the last input
    if (value && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const pasteDigits = paste.replace(/\D/g, '').split('').slice(0, 6);

    if (pasteDigits.length === 6) {
      setOtp(pasteDigits);
      // Focus the last input after pasting
      setTimeout(() => {
        if (otpInputRefs.current[5]) {
          otpInputRefs.current[5].focus();
        }
      }, 10);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setVerificationError('Please enter the complete 6-digit code');
      return;
    }

    try {
      setIsVerifying(true);
      setVerificationError('');

      const response = await axios.post(api.auth.verifyuser, {
        email,
        password,
        otp: otpValue,
        firstname,
        lastname
      });

      if (response.status === 200) {
        alert('Verification successful! You can now log in.');
        setShowOtpModal(false);
        // Reset form
        setFirstname('');
        setLastname('');
        setEmail('');
        setPassword('');
        setOtp(['', '', '', '', '', '']);
      }
    } catch (error) {
      console.error('Error during verification:', error);
      setVerificationError(error.response?.data?.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div>


      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ backgroundImage: "url('/login.png')" }}>
        {/* Animated background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>

        {/* Floating particles effect - Static UI */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Static particles for visual effect */}
          <div className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-50" style={{ left: '10%', top: '20%' }}></div>
          <div className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-50" style={{ left: '30%', top: '40%' }}></div>
          <div className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-50" style={{ left: '50%', top: '60%' }}></div>
          <div className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-50" style={{ left: '70%', top: '30%' }}></div>
          <div className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-50" style={{ left: '90%', top: '50%' }}></div>
        </div>

        <div className="max-w-6xl w-full mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left Side - Welcome Section */}
            <div className="text-white space-y-6 hidden md:block">
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full shadow-2xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>

                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                    Create Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Account</span>
                  </h1>
                  <p className="text-xl lg:text-2xl text-white/90 font-light">
                    Join our amazing community today!
                  </p>
                  <p className="text-lg text-white/80 leading-relaxed">
                    Sign up to get access to exclusive features, personalized content, and connect with others. Your journey starts here.
                  </p>
                </div>

                <div className="space-y-4 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Free Forever</h3>
                      <p className="text-white/70 text-sm">No hidden fees or surprise charges</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Quick Setup</h3>
                      <p className="text-white/70 text-sm">Get started in less than 2 minutes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Secure & Private</h3>
                      <p className="text-white/70 text-sm">Your data is always protected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full max-w-md mx-auto md:mx-0">
              <form className="register-form bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6 border border-white/10">

                {/* Mobile Header */}
                <div className="text-center space-y-4 md:hidden">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Create Account
                  </h2>
                  <p className="text-gray-300 text-sm">Join us today and start your journey</p>
                </div>

                {/* Desktop Header */}
                <div className="text-center space-y-4 hidden md:block">
                  <h2 className="text-3xl font-bold text-white mb-2">Sign Up</h2>
                  <p className="text-gray-300 text-sm">Create your account to get started</p>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstname" className="text-white text-sm font-medium flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      First Name
                    </label>
                    <input
                      id="firstname"
                      name="firstname"
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="your name"
                      value={firstname}
                      onChange={userfirstname}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastname" className="text-white text-sm font-medium flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Last Name
                    </label>
                    <input
                      id="lastname"
                      name="lastname"
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="your lastname"
                      value={lastname}
                      onChange={userlastname}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-white text-sm font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="google@gmail.com"
                      value={email}
                      onChange={useremail}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-white text-sm font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 pr-12"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={userpassword}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      onClick={handlesubmit}
                      disabled={isLoading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>


                {/* Terms Agreement */}
                <div className="flex items-start">
                  <input
                    id="agree-terms"
                    name="agree-terms"
                    type="checkbox"
                    required
                    defaultChecked={false}
                    className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded bg-white/10 border-white/20"
                    onChange={(e) => { }}
                  />
                  <label htmlFor="agree-terms" className="ml-2 text-sm text-gray-300">
                    I agree to the{' '}
                    <a href="#" className="text-purple-400 hover:text-purple-300 font-medium">
                      Terms and Conditions
                    </a>
                    {' '}and{' '}
                    <a href="#" className="text-purple-400 hover:text-purple-300 font-medium">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Error Message - Static UI */}
                <div className="rounded-xl bg-red-500/20 border border-red-500/30 p-4 backdrop-blur-sm hidden">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-200">Sample error message</p>
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]"
                  onClick={handlesubmit}
                >
                  Create Account
                </button>

                {/* Login Link */}
                <div className="text-center text-gray-300 pt-4 border-t border-white/10">
                  <span className="text-sm">Already have an account? </span>
                  <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline">
                    Sign In
                  </Link>
                </div>

              </form>
            </div>

          </div>
        </div>

        {/* OTP Modal */}
        {showOtpModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-black/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6 border border-white/10 max-w-md w-full">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Verify Your Email</h2>
                <p className="text-gray-300 text-sm">Enter the 6-digit code we sent to {email}</p>
              </div>

              <form onSubmit={handleVerifySubmit} className="space-y-6">
                {/* OTP Input Fields */}
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Verification Code
                  </label>
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-14 h-16 text-center text-2xl font-bold bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        placeholder=""
                      />
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs text-center mt-2">We sent a 6-digit code to your email</p>
                </div>

                {verificationError && (
                  <div className="rounded-xl bg-red-500/20 border border-red-500/30 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-red-200">{verificationError}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                    onClick={() => setShowOtpModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]"
                    disabled={isVerifying || otp.some(digit => digit === '')}
                  >
                    {isVerifying ? 'Verifying...' : 'Verify Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}