import Link from "next/link";
import { Home, Compass, ArrowLeft, ShieldCheck } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center py-12 px-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 mb-6 font-mono text-3xl font-black shadow-inner">
          404
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          The page you are looking for might have been moved, renamed, or is temporarily unavailable. All system backups and services remain operational.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition shadow-md shadow-blue-500/20"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl text-sm transition"
          >
            <Compass className="w-4 h-4" />
            Contact Support
          </Link>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>SemikDev System & Backup Engine Active</span>
        </div>
      </div>
    </div>
  );
}
