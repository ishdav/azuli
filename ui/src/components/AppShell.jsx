"use client";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/BottomNav";
import TopNav from "@/components/TopNav";
import { Suspense } from "react";
import Loader from "@/components/Loader";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="w-full h-full overflow-hidden bg-slate-100">
        <Suspense fallback={<Loader message="Loading admin..." />}>
          {children}
        </Suspense>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex justify-center bg-slate-300">
      <div className="flex h-full w-full md:max-w-5xl bg-slate-50 md:shadow-2xl md:border-x md:border-slate-300/50 relative flex-col md:flex-row">
        
        <Sidebar />
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          <TopNav />

          {/* ✅ Main content with top padding */}
          <main className="flex-1 h-full overflow-y-auto bg-slate-50 relative flex justify-center pt-4 md:pt-6">
            <div className="w-full max-w-2xl min-h-full">
              <Suspense fallback={<Loader message="Loading page..." />}>
                {children}
              </Suspense>
            </div>
          </main>
        </div>

      </div>
    </div>
  );
}