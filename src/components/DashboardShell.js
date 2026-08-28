"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FilePlus,
  FileEdit,
  Users,
  MessageCircle,
  Home,
  ArrowLeft,
} from "lucide-react";

const quickLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/create-article", label: "Create", icon: FilePlus },
  { href: "/update-article", label: "Update", icon: FileEdit },
  { href: "/friends", label: "Friends", icon: Users },
  { href: "/chat", label: "Messages", icon: MessageCircle },
];

export function DashboardLoader({ label = "Loading..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block w-10 h-10 border-[3px] border-blue-600 border-t-transparent rounded-full"
        />
        <p className="mt-4 text-gray-600 text-sm font-medium">{label}</p>
      </motion.div>
    </div>
  );
}

export default function DashboardShell({
  title,
  subtitle,
  backHref,
  actions,
  showQuickNav = true,
  maxWidth = "max-w-7xl",
  children,
}) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/update-article") return pathname.startsWith("/update-article");
    if (href === "/chat") return pathname === "/chat" || pathname.startsWith("/chat/");
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400" />

      <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8`}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
            <div className="flex items-start gap-3">
              {backHref && (
                <Link
                  href={backHref}
                  className="mt-1 p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              )}
              <div>
                {title && (
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">{subtitle}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {actions}
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:text-blue-600 hover:border-blue-200 transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
            </div>
          </div>

          {showQuickNav && (
            <nav className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {quickLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive(href)
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200 hover:text-blue-600 hover:border-blue-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export function DashCard({ children, className = "", hover = true }) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${
        hover ? "hover:shadow-md hover:border-blue-100 transition-all duration-200" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
