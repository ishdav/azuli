"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Layers, Users, Wallet, LogOut, User } from "lucide-react";
import { useApp } from "@/context/AppContext";
import Logo from "../../public/logo.svg";
import Image from "next/image";

export default function BottomNav() {
  const pathname = usePathname();
  const { user, logout } = useApp();
  const router = useRouter();

  if (!user) return null;
  if (pathname.startsWith("/admin")) return null;

  const tabs = [
    { name: "Home", icon: LayoutDashboard, path: "/home" },
    { name: "Nodes", icon: Layers, path: "/plans" },
    { name: "Team", icon: Users, path: "/team" },
    { name: "Portfolio", icon: Wallet, path: "/profile" },
  ];

  return (
    // hidden md:flex ensures it is ONLY visible on desktop screens
    <aside className="hidden md:flex w-20 h-full bg-white border-r border-slate-200 flex-col items-center py-6 z-50 flex-shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      
      <div className="flex items-center justify-center h-20 flex-shrink-0">
        <Link href="/home" className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-[0 0 10px indigo-600/30  ] hover:scale-105 transition-transform">
          <span className="text-white font-bold text-lg">
            <Image src={Logo} alt="Azuli Logo" width={20} height={20} title="Azuli" />
          </span>
        </Link>
      </div>
      
      <nav className="flex flex-col gap-4 flex-1 w-full px-3 mt-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          const Icon = tab.icon;
          
          return (
            <Link
              key={tab.name}
              href={tab.path}
              className={`relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? "bg-indigo-50 text-indigo-600" 
                  : "text-slate-400 hover:text-indigo-600 hover:bg-slate-50"
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              
              {/* Active Indicator Pill */}
              {isActive && (
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full"></span>
              )}

              {/* Hover Tooltip */}
              <span className="absolute left-16 bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl z-50">
                {tab.name}
              </span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto flex flex-col items-center gap-6 w-full px-3 pb-6">
        <button 
          onClick={() => { logout(); router.push("/"); }} 
          className="relative flex items-center justify-center w-14 h-14 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300 group"
        >
          <LogOut size={24} strokeWidth={2} />
          <span className="absolute left-16 bg-rose-600 text-white text-xs font-bold px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl z-50">
            Log Out
          </span>
        </button>
        
        <Link href="/profile" className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-bold text-sm hover:border-indigo-200 transition-colors">
          <User />
        </Link>
      </div>
    </aside>
  );
}