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
    <footer className="relative bg-white text-gray-800 py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 lg:gap-10">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">
              Semik<span className="text-blue-600">Dev</span>
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Creating modern fullstack web solutions and high-performance digital experiences.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Navigation</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              {isLoggedIn ? (
                <>
                  <li><Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link></li>
                  <li><Link href="/update-article" className="hover:text-blue-600 transition-colors">Update Article</Link></li>
                  <li><Link href="/create-article" className="hover:text-blue-600 transition-colors">Create Article</Link></li>
                </>
              ) : (
                <>
                  <li><Link href="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
                  <li><Link href="/about" className="hover:text-blue-600 transition-colors">About</Link></li>
                  <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
                </>
              )}
              <li><Link href="/reels" className="hover:text-blue-600 transition-colors">Reels</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Account</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              {isLoggedIn ? (
                <li>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      window.dispatchEvent(new Event("storage"));
                      window.location.href = "/login";
                    }}
                    className="text-red-600 hover:text-red-700 font-semibold transition-colors"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li><Link href="/login" className="hover:text-blue-600 transition-colors">Login</Link></li>
                  <li><Link href="/register" className="hover:text-blue-600 transition-colors">Register</Link></li>
                </>
              )}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Connect</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Let&apos;s build something incredible together. Reach out for collaborations and custom projects.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-gray-500 text-xs">
          <p>&copy; {new Date().getFullYear()} SemikDev. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
