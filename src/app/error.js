"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert, RefreshCw, Home, Copy, Check, Terminal, AlertTriangle } from "lucide-react";

export default function GlobalErrorPage({ error, reset }) {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log the error to console or telemetry
    console.error("🚨 [CRASH RECOVERY] Intercepted runtime error:", error);
  }, [error]);

  const handleCopyDiagnostics = () => {
    const diagnosticData = JSON.stringify(
      {
        message: error?.message || "Unknown error",
        stack: error?.stack || "No stack trace available",
        time: new Date().toISOString(),
        url: typeof window !== "undefined" ? window.location.href : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      },
      null,
      2
    );

    navigator.clipboard.writeText(diagnosticData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleHardRefresh = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-xl w-full bg-[#111827]/90 border border-gray-800 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8">
        
        {/* Top Header Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800/80 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-100 flex items-center gap-2">
                System Protected
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Safe Mode
                </span>
              </h1>
              <p className="text-xs text-gray-400">Automated crash isolation active</p>
            </div>
          </div>
        </div>

        {/* Informational Box */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-gray-300 space-y-1">
              <p className="font-semibold text-gray-200">
                An unexpected interface issue was safely caught.
              </p>
              <p className="text-gray-400">
                Your database records, session data, and backups remain completely secure. You can safely try auto-recovery or return to the home screen.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => reset ? reset() : handleHardRefresh()}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-blue-500/20 active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" />
            Try Auto-Recovery
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-semibold rounded-xl transition border border-gray-700 active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            Return to Home
          </Link>
        </div>

        {/* Secondary Actions / Diagnostic Expander */}
        <div className="pt-4 border-t border-gray-800/80">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1.5 hover:text-gray-200 transition"
            >
              <Terminal className="w-3.5 h-3.5" />
              {showDetails ? "Hide technical details" : "View technical details"}
            </button>

            <button
              onClick={handleCopyDiagnostics}
              className="flex items-center gap-1.5 hover:text-gray-200 transition"
              title="Copy error report to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Report</span>
                </>
              )}
            </button>
          </div>

          {showDetails && (
            <div className="mt-3 p-3 bg-black/60 border border-gray-800 rounded-lg text-[11px] font-mono text-rose-300 overflow-x-auto max-h-48">
              <p className="font-bold text-rose-400 mb-1">{error?.name || "Error"}: {error?.message || "An unexpected error occurred"}</p>
              {error?.stack && (
                <pre className="text-gray-400 whitespace-pre-wrap">{error.stack}</pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
