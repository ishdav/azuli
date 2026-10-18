"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header({ title, showBack = true, rightAction }) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b rounded-md border-slate-100 px-4 py-4 flex justify-between items-center">
      {/* Left: Back Button */}
      <div className="w-10 flex justify-start">
        {showBack && (
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </button>
        )}
      </div>
      
      {/* Center: Title */}
      <h1 className="text-base font-bold text-slate-900 tracking-tight text-center flex-1">
        {title}
      </h1>
      
      {/* Right: Action (if any) */}
      <div className="w-10 flex justify-end">
        {rightAction}
      </div>
    </header>
  );
}