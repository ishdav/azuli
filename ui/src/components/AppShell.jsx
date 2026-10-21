"use client";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/BottomNav";
import { Suspense } from "react";
import Loader from "@/components/Loader"; // Assuming you have the Loader component

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // ADMIN: Full screen
  if (isAdmin) {
    return (
      <div className="w-full h-full overflow-hidden bg-slate-100">
        <Suspense fallback={<Loader message="Loading admin..." />}>
          {children}
        </Suspense>
      </div>
    );
  }

  // USER APP
  return (
    <div className="w-full h-full flex justify-center bg-slate-300">
      <div className="flex h-full w-full md:max-w-5xl bg-slate-50 md:shadow-2xl md:border-x md:border-slate-300/50 relative">
        
        <Sidebar />
        
        <main className="flex-1 h-full overflow-y-auto bg-slate-50 relative pb-16 md:pb-0 flex justify-center">
          <div className="w-full max-w-2xl min-h-full">
            {/* ✅ Wrap children in Suspense to prevent build crashes */}
            <Suspense fallback={<Loader message="Loading page..." />}>
              {children}
            </Suspense>
          </div>
        </main>
        
      </div>
    </div>
  );
}