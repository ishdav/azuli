"use client";
import { Loader2 } from "lucide-react";

export default function Loader({ fullScreen = true, message = "Loading..." }) {
  if (fullScreen) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 absolute inset-0 z-50">
        <div className="relative flex items-center justify-center">
          {/* Outer glowing ring */}
          <div className="absolute w-16 h-16 border-4 border-indigo-100 rounded-full animate-ping opacity-50"></div>
          {/* Spinning Icon */}
          <Loader2 className="animate-spin text-indigo-600 relative z-10" size={36} />
        </div>
        {message && (
          <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
            {message}
          </p>
        )}
      </div>
    );
  }

  // Inline loader (for buttons)
  return <Loader2 className="animate-spin text-current" size={18} />;
}