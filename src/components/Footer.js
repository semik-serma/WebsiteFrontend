"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  return (
    <footer className="relative bg-slate-950/80 backdrop-blur-xl text-white py-14 border-t border-cyan-500/20 overflow-hidden">
      
      {/* Ambient Blue/Cyan Glow Lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[160px]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-600 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-white">
              Semik<span className="text-white">Dev</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Creating modern fullstack web solutions and high-performance digital experiences.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white mb-4 tracking-wider text-sm uppercase text-cyan-400">Navigation</h4>
            <ul className="space-y-2.5 text-slate-400 text-sm">
              {isLoggedIn ? (
                <>
                  <li><Link href="/dashboard" className="hover:text-cyan-300 transition-colors">Dashboard</Link></li>
                  <li><Link href="/update-article" className="hover:text-cyan-300 transition-colors">Update Article</Link></li>
                  <li><Link href="/create-article" className="hover:text-cyan-300 transition-colors">Create Article</Link></li>
                </>
              ) : (
                <>
                  <li><Link href="/" className="hover:text-cyan-300 transition-colors">Home</Link></li>
                  <li><Link href="/about" className="hover:text-cyan-300 transition-colors">About</Link></li>
                  <li><Link href="/contact" className="hover:text-cyan-300 transition-colors">Contact</Link></li>
                </>
              )}
              <li><Link href="/reels" className="hover:text-cyan-300 transition-colors">Reels</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-bold text-white mb-4 tracking-wider text-sm uppercase text-cyan-400">Account</h4>
            <ul className="space-y-2.5 text-slate-400 text-sm">
              {isLoggedIn ? (
                <li>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      window.dispatchEvent(new Event("storage"));
                      window.location.href = "/login";
                    }}
                    className="text-red-400 hover:text-red-300 font-semibold transition-colors"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li><Link href="/login" className="hover:text-cyan-300 transition-colors">Login</Link></li>
                  <li><Link href="/register" className="hover:text-cyan-300 transition-colors">Register</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h4 className="font-bold text-white mb-4 tracking-wider text-sm uppercase text-cyan-400">Connect</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Let&apos;s build something incredible together. Reach out for collaborations and custom projects.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-slate-400 text-xs font-medium">
          <p>&copy; {new Date().getFullYear()} SemikDev. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
