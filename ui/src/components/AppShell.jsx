"use client";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/BottomNav";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // ADMIN: Full screen
  if (isAdmin) {
    return (
      <div className="w-full h-full overflow-hidden bg-slate-100">
        {children}
      </div>
    );
  }

  // USER APP
  return (
    <div className="w-full h-full flex justify-center bg-gray">
      {/* 
        The total app width is capped at max-w-5xl (1024px). 
        This keeps the sidebar and content grouped closely together 
        without stretching across massive ultra-wide monitors.
      */}
      <div className="flex h-full w-full md:max-w-5xl bg-slate-50 md:shadow-2xl md:border-x md:border-slate-300/50 relative">
        
        <Sidebar />
        
        {/* 
          Main Content Area:
          Using flex and justify-center to perfectly center the content 
          within the space remaining next to the sidebar.
        */}
        <main className="flex-1 h-full overflow-y-auto bg-slate-50 relative pb-16 md:pb-0 flex justify-center">
          
          {/* The actual content block */}
          <div className="w-full max-w-2xl min-h-full">
            {children}
          </div>
          
        </main>
        
      </div>
    </div>
  );
}