"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Receipt, LogOut, ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import { api } from "@/services/api";

export default function AdminSidebar({ onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    api.adminLogout();
    router.push("/admin/login");
  };

  const navItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/admin" },
    { name: "User Management", icon: Users, path: "/admin/users" },
    { name: "All Transactions", icon: Receipt, path: "/admin/transactions" },
  ];

  return (
    <aside className="w-[280px] h-full bg-[#09090b] flex flex-col border-r border-slate-800 flex-shrink-0 text-slate-300">
      
      {/* Brand */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-indigo-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-tight block leading-tight">Azuli Admin</span>
            <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">Control Center</span>
          </div>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? "bg-slate-800 text-white font-semibold shadow-sm" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50 font-medium"
              }`}
            >
              <item.icon size={18} className={isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800/50 space-y-2">
        <Link
          href="/home"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all font-medium"
        >
          <ArrowLeft size={18} className="text-slate-500" />
          <span className="text-sm">Return to App</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all font-medium"
        >
          <LogOut size={18} />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}