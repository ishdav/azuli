"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers, Users, Wallet } from "lucide-react";
import { useApp } from "@/context/AppContext"; // ✅ Import useApp

export default function TopNav() {
  const pathname = usePathname();
  const { user } = useApp(); // ✅ Get the user state
  
  // ✅ If no user is logged in, hide the nav completely
  if (!user) return null;

  const tabs = [
    { name: "Home", icon: LayoutDashboard, path: "/home" },
    { name: "Plans", icon: Layers, path: "/plans" },
    { name: "Team", icon: Users, path: "/team" },
    { name: "Profile", icon: Wallet, path: "/profile" },
  ];

  return (
    <div className="md:hidden sticky top-0 flex justify-around items-center bg-white/90 backdrop-blur-md border-b border-slate-100 py-2 px-1 shadow-sm z-50 flex-shrink-0">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        const Icon = tab.icon;
        
        return (
          <Link
            key={tab.name}
            href={tab.path}
            className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-300 ${
              isActive 
                ? "bg-indigo-50 text-indigo-600" 
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] mt-1 ${isActive ? "font-bold" : "font-medium"}`}>
              {tab.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}