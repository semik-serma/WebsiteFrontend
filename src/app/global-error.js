"use client";

import { RefreshCw, Home, ShieldAlert } from "lucide-react";

export default function GlobalRootError({ error, reset }) {
  return (
    <html lang="en">
      <head>
        <title>System Recovery | SemikDev</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-[#0a0f1d] text-white flex items-center justify-center p-4 font-sans antialiased">
        <div className="max-w-md w-full bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-center">
          <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <h1 className="text-xl font-bold text-gray-100 mb-2">
            Disaster Recovery Mode
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            The application encountered a critical interface exception. Your data and backups are safe.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => reset ? reset() : window.location.reload()}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reload & Recover
            </button>
            <button
              onClick={() => window.location.href = "/"}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-xl text-sm transition border border-gray-700 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go to Homepage
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
