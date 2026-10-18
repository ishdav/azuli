"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Menu, ShieldCheck } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin_session") === "true";
    if (!isAdmin && pathname !== "/admin/login") {
      router.push("/admin/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router, pathname]);

  if (pathname === "/admin/login") return children;
  if (!isAuthorized) return null;

  return (
    // This div takes up the full screen width
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden">
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full w-[280px] flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-indigo-600" />
            <span className="font-bold text-slate-900 text-sm">Admin Control</span>
          </div>
          
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <button className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors">
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px] bg-[#09090b] border-none">
              <AdminSidebar onNavigate={() => setIsMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
          {/* No max-width constraint here, it will stretch fully */}
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}