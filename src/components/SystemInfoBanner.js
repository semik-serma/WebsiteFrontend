'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Monitor, Smartphone, Cpu, MonitorSmartphone, Globe, Maximize2, HardDrive } from 'lucide-react';

function getSystemInfo() {
  const ua = navigator.userAgent;
  let os = 'Unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Chrome OS')) os = 'ChromeOS';

  let browser = 'Unknown';
  if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('OPR') || ua.includes('Opera')) browser = 'Opera';

  let device = 'Desktop';
  if (/Mobi|Android/i.test(ua)) device = 'Mobile';
  else if (/Tablet|iPad/i.test(ua)) device = 'Tablet';

  return {
    os,
    browser,
    device,
    screen: `${screen.width}x${screen.height}`,
    language: navigator.language,
    cores: navigator.hardwareConcurrency || 'Unknown',
    userAgent: ua,
  };
}

export default function SystemInfoBanner() {
  const [showNotification, setShowNotification] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [info, setInfo] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setShowNotification(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  const handleOpen = () => {
    setInfo(getSystemInfo());
    setShowModal(true);
    setShowNotification(false);
    setDismissed(true);
  };

  const handleDismiss = () => {
    setShowNotification(false);
    setDismissed(true);
  };

  const rows = info ? [
    { icon: Monitor, label: 'Operating System', value: info.os },
    { icon: Globe, label: 'Browser', value: info.browser },
    { icon: MonitorSmartphone, label: 'Device Type', value: info.device },
    { icon: Maximize2, label: 'Screen Resolution', value: info.screen },
    { icon: HardDrive, label: 'Language', value: info.language },
    { icon: Cpu, label: 'CPU Cores', value: info.cores },
  ] : [];

  return (
    <>
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[100] max-w-sm"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">System Info</p>
                <p className="text-xs text-gray-600 mt-0.5">See your system information now</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleOpen}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MonitorSmartphone className="w-6 h-6 text-white" />
                  <h2 className="text-lg font-bold text-white">System Information</h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white/80 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {rows.map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <row.icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">{row.label}</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
