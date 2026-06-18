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
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-blue-400 mb-4">
              Semik<span className="text-white">Dev</span>
            </h3>
            <p className="text-gray-400">
              Creating modern web solutions for your business.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <ul className="space-y-2 text-gray-400">
              {isLoggedIn ? (
                <>
                  <li><Link href="/dashboard">Dashboard</Link></li>
                  <li><Link href="/update-article">Update Article</Link></li>
                  <li><Link href="/create-article">Create Article</Link></li>
                </>
              ) : (
                <>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/about">About</Link></li>
                  <li><Link href="/contact">Contact</Link></li>
                </>
              )}
              <li><Link href="/reels">Reels</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-gray-400">
              {isLoggedIn ? (
                <li>
                  <button
  onClick={() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("storage")); // 🔥 refresh UI
    window.location.href = "/login";
  }}
  className="text-red-400 hover:text-red-500"
>
  Logout
</button>

                </li>
              ) : (
                <>
                  <li><Link href="/login">Login</Link></li>
                  <li><Link href="/register">Register</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <p className="text-gray-400">
              Let's build something amazing together.
            </p>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SemikDev. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
