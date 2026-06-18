"use client";

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { api } from '@/lib/api';

export default function VerifyPage() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const inputRefs = useRef([]);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleInputChange = (index, value) => {
        if (value.length > 1) return;
        if (value !== "" && isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is entered and not the last input
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            // Move to previous input on backspace if current input is empty
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').trim();
        const pasteDigits = paste.replace(/\D/g, '').split('').slice(0, 6);

        if (pasteDigits.length > 0) {
            const newOtp = [...otp];
            pasteDigits.forEach((digit, i) => {
                newOtp[i] = digit;
            });
            setOtp(newOtp);
            // Focus next empty box or last filled box
            const nextIndex = Math.min(pasteDigits.length, 5);
            setTimeout(() => {
                if (inputRefs.current[nextIndex]) {
                    inputRefs.current[nextIndex].focus();
                }
            }, 10);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 6 || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post(api.auth.verifyuser, {
                email,
                password,
                otp: otpValue
            });

            if (response.status === 200) {
                alert('Verification successful! You can now log in.');
                // Reset form
                setOtp(['', '', '', '', '', '']);
                setEmail('');
                setPassword('');
            }
        } catch (error) {
            console.error('Error during verification:', error);
            alert('Verification failed: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleResendCode = async () => {
        if (!email) {
            alert('Please enter your email');
            return;
        }

        try {
            const response = await axios.post(api.auth.register, { email });
            if (response.status === 200) {
                alert('New verification code sent to your email');
            }
        } catch (error) {
            console.error('Error resending code:', error);
            alert('Failed to resend code: ' + (error.response?.data?.message || error.message));
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>

                                <div className="space-y-4">
                                    <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                                        Verify Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Account</span>
                                    </h1>
                                    <p className="text-xl lg:text-2xl text-white/90 font-light">
                                        Enter the code we sent to your email
                                    </p>
                                    <p className="text-lg text-white/80 leading-relaxed">
                                        We've sent a 6-digit verification code to your email address. Please enter it below to complete your registration.
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
                                            <h3 className="text-white font-semibold">Secure Verification</h3>
                                            <p className="text-white/70 text-sm">Your account security is our priority</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">Quick Process</h3>
                                            <p className="text-white/70 text-sm">Verify in less than 1 minute</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">Email Protection</h3>
                                            <p className="text-white/70 text-sm">Your email is always protected</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Verify Form */}
                        <div className="w-full max-w-md mx-auto md:mx-0">
                            <form className="verify-form bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6 border border-white/10" onSubmit={handleSubmit}>

                                {/* Mobile Header */}
                                <div className="text-center space-y-4 md:hidden">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4 shadow-lg">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        Verify Account
                                    </h2>
                                    <p className="text-gray-300 text-sm">Enter the code sent to your email</p>
                                </div>

                                {/* Desktop Header */}
                                <div className="text-center space-y-4 hidden md:block">
                                    <h2 className="text-3xl font-bold text-white mb-2">Verify Your Email</h2>
                                    <p className="text-gray-300 text-sm">Enter the 6-digit code we sent to your email</p>
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
                                            value={email}
                                            onChange={handleEmailChange}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                            placeholder="name@example.com"
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
                                            value={password}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 pr-12"
                                            placeholder="Min. 8 characters"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                            onClick={(e) => { }}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* OTP Input Fields */}
                                <div className="space-y-2">
                                    <label htmlFor="otp" className="text-white text-sm font-medium flex items-center gap-2">
                                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Verification Code
                                    </label>
                                    <div className="flex justify-center gap-3">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => (inputRefs.current[index] = el)}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleInputChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                onPaste={handlePaste}
                                                className="w-14 h-16 text-center text-2xl font-bold bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                                placeholder=""
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-400 text-xs text-center mt-2">We sent a 6-digit code to your email</p>
                                </div>

                                {/* Resend Code Link */}
                                <div className="text-center text-gray-300">
                                    <p className="text-sm">Didn't receive the code? <button type="button" onClick={handleResendCode} className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline" disabled={!email}>Resend Code</button></p>
                                </div>

                                {/* Error Message - Static UI */}
                                <div className="rounded-xl bg-red-500/20 border border-red-500/30 p-4 backdrop-blur-sm hidden">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-red-200">Invalid verification code. Please try again.</p>
                                    </div>
                                </div>

                                {/* Verify Button */}
                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]"
                                    disabled={otp.some(digit => digit === '') || !email || !password}
                                >
                                    Verify Account
                                </button>

                                {/* Back to Login Link */}
                                <div className="text-center text-gray-300 pt-4 border-t border-white/10">
                                    <span className="text-sm">Need to change your email? </span>
                                    <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline">
                                        Go Back
                                    </Link>
                                </div>

                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}