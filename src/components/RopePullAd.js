"use client";

import React, { useState } from "react";

export default function RopePullAd({ compact = false }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href="https://www.phidimbazar.com"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative inline-flex items-center select-none text-decoration-none transition-transform duration-300 ${
        compact ? "scale-90 origin-left" : ""
      }`}
      title="Visit www.phidimbazar.com"
    >
      {/* Container holding the Man, Rope, and Banner */}
      <div className="flex items-center relative py-1">
        
        {/* --- 1. THE PULLING MAN --- */}
        <div
          className={`relative z-10 flex items-center justify-center transition-all duration-300 ${
            isHovered ? "scale-110 -translate-x-1" : "animate-[pullMotion_2s_ease-in-out_infinite]"
          }`}
        >
          {/* Sweat / Effort drops when pulling */}
          {!isHovered && (
            <div className="absolute -top-1 -left-1 flex space-x-0.5 pointer-events-none">
              <span className="inline-block w-1.5 h-1.5 bg-cyan-400 rounded-full animate-[sweatDrop_1.5s_infinite_ease-out]"></span>
              <span className="inline-block w-1 h-1 bg-blue-400 rounded-full animate-[sweatDrop_1.5s_infinite_0.4s_ease-out]"></span>
            </div>
          )}

          {/* SVG Stickman / Puller Figure */}
          <svg
            width="34"
            height="36"
            viewBox="0 0 34 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible filter drop-shadow-sm"
          >
            {/* Ground shadow */}
            <ellipse cx="14" cy="34" rx="10" ry="2" fill="rgba(0,0,0,0.12)" />

            {/* Back Leg (Bracing & planted) */}
            <path
              d="M 12 21 L 6 27 L 3 33"
              stroke="#1e293b"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Back Foot */}
            <path d="M 3 33 L 1 33" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />

            {/* Front Leg (Bent for heavy pulling leverage) */}
            <path
              d="M 14 21 L 18 27 L 16 33"
              stroke="#0f172a"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Front Foot */}
            <path d="M 16 33 L 19 33" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />

            {/* Torso (Leaning backward with tension) */}
            <path
              d={isHovered ? "M 15 13 L 14 22" : "M 16 13 L 12 22"}
              stroke="#2563eb"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="transition-all duration-300"
            />

            {/* Puller's Head */}
            <circle
              cx={isHovered ? 16 : 18}
              cy="8"
              r="5"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="1.2"
              className="transition-all duration-300"
            />
            {/* Cute Hat / Headband */}
            <path
              d={isHovered ? "M 11 6 Q 16 3 21 6" : "M 13 6 Q 18 3 23 6"}
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Eye / Expression */}
            {isHovered ? (
              // Happy / Wink eye
              <path d="M 17 8 Q 18 7 19 8" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />
            ) : (
              // Determined effort eye (focus line)
              <circle cx="19" cy="8" r="0.8" fill="#1e293b" />
            )}

            {/* Back Arm (Pulling rope) */}
            <path
              d={isHovered ? "M 15 14 L 20 12 L 23 7" : "M 15 14 L 22 17 L 29 18"}
              stroke="#1d4ed8"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />

            {/* Front Arm (Gripping rope firmly) */}
            <path
              d={isHovered ? "M 14 15 L 18 19 L 26 20" : "M 14 15 L 20 18 L 31 19"}
              stroke="#2563eb"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />

            {/* Hands (Grip spheres) */}
            <circle cx={isHovered ? 26 : 31} cy={isHovered ? 20 : 19} r="1.8" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
            <circle cx={isHovered ? 23 : 28} cy={isHovered ? 19 : 18} r="1.6" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />

            {/* Thumbs up when hovered! */}
            {isHovered && (
              <g className="animate-bounce">
                <text x="22" y="6" fontSize="10">👍</text>
              </g>
            )}
          </svg>
        </div>

        {/* --- 2. THE TENSION ROPE --- */}
        <div className="relative w-7 sm:w-9 h-6 flex items-center -ml-1 -mr-1 z-0 overflow-visible pointer-events-none">
          <svg width="100%" height="24" viewBox="0 0 36 24" fill="none" className="overflow-visible">
            {/* Shadow under rope */}
            <path
              d={
                isHovered
                  ? "M 2 15 Q 18 18 36 15"
                  : "M 2 13 Q 18 10 36 13"
              }
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Main Textured Rope */}
            <path
              d={
                isHovered
                  ? "M 2 14 Q 18 17 36 14" // Slack when stopped/hovered
                  : "M 2 12 Q 18 12 36 12" // Taut line when pulling
              }
              stroke="#b45309"
              strokeWidth="2.8"
              strokeDasharray={isHovered ? "3 1.5" : "none"}
              strokeLinecap="round"
              className="transition-all duration-300"
            />

            {/* Rope Inner Highlight / Strand Detail */}
            <path
              d={
                isHovered
                  ? "M 2 13.5 Q 18 16.5 36 13.5"
                  : "M 2 11.5 Q 18 11.5 36 11.5"
              }
              stroke="#fef08a"
              strokeWidth="0.8"
              strokeDasharray="2 2"
              strokeLinecap="round"
            />

            {/* Knot at Banner Attachment Hook */}
            <circle cx="34" cy={isHovered ? 14 : 12} r="2.2" fill="#78350f" />
            <circle cx="34" cy={isHovered ? 14 : 12} r="1.2" fill="#fbbf24" />
          </svg>
        </div>

        {/* --- 3. THE AD BANNER (Pulled behind) --- */}
        <div
          className={`relative z-10 flex items-center rounded-xl px-2.5 py-1 sm:px-3 sm:py-1.5 transition-all duration-300 cursor-pointer ${
            isHovered
              ? "scale-105 shadow-lg shadow-pink-500/25 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white"
              : "animate-[cartFollow_2s_ease-in-out_infinite] bg-white/90 hover:bg-white border border-pink-200/80 shadow-sm"
          }`}
        >
          {/* Gradient Border Glow */}
          <span
            className={`absolute -inset-[1px] rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 -z-10 opacity-70 blur-[1px] transition-opacity duration-300 ${
              isHovered ? "opacity-100 blur-[2px]" : "opacity-60"
            }`}
          ></span>

          {/* Tiny Wheels under banner for cart/sled feel */}
          <div className="absolute -bottom-1 left-2 w-1.5 h-1.5 bg-gray-700 rounded-full border border-gray-300"></div>
          <div className="absolute -bottom-1 right-2 w-1.5 h-1.5 bg-gray-700 rounded-full border border-gray-300"></div>

          {/* Small Hook / Eyelet on the left */}
          <span
            className={`absolute -left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 transition-colors ${
              isHovered ? "border-amber-300 bg-amber-500" : "border-pink-400 bg-pink-100"
            }`}
          ></span>

          {/* Icon Badge */}
          <span className="mr-1.5 text-xs sm:text-sm animate-pulse">🛍️</span>

          {/* Ad Label & Domain */}
          <div className="flex items-center gap-1">
            <span
              className={`text-[10px] font-black uppercase px-1 py-0.2 rounded tracking-wider ${
                isHovered
                  ? "bg-white text-pink-600 font-extrabold"
                  : "bg-pink-100 text-pink-600 font-bold"
              }`}
            >
              Ad
            </span>
            <span
              className={`text-xs sm:text-sm font-extrabold tracking-tight transition-colors ${
                isHovered
                  ? "text-white drop-shadow-sm"
                  : "bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent"
              }`}
            >
              phidimbazar.com
            </span>
          </div>

          {/* Arrow indicator */}
          <svg
            className={`w-3.5 h-3.5 ml-1 transition-transform duration-300 ${
              isHovered ? "translate-x-0.5 -translate-y-0.5 text-yellow-200" : "text-pink-500"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H9M17 7V15" />
          </svg>
        </div>
      </div>

      {/* Global CSS Keyframes for pull & recoil physics */}
      <style jsx global>{`
        @keyframes pullMotion {
          0%, 100% {
            transform: translateX(0px) rotate(0deg);
          }
          20% {
            transform: translateX(-3px) rotate(-6deg);
          }
          45% {
            transform: translateX(-6px) rotate(-11deg);
          }
          65% {
            transform: translateX(-5px) rotate(-9deg);
          }
          85% {
            transform: translateX(-1px) rotate(-2deg);
          }
        }

        @keyframes cartFollow {
          0%, 100% {
            transform: translateX(0px);
          }
          25% {
            transform: translateX(-1px);
          }
          50% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(-4px);
          }
          90% {
            transform: translateX(-0.5px);
          }
        }

        @keyframes sweatDrop {
          0% {
            opacity: 0;
            transform: translateY(0px) scale(0.6);
          }
          40% {
            opacity: 1;
            transform: translate(-3px, -4px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-6px, -8px) scale(0.3);
          }
        }
      `}</style>
    </a>
  );
}
