"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Cpu, Users, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const tabs = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Equipment", icon: Cpu, path: "/equipment" },
    { name: "Team", icon: Users, path: "/team" },
    { name: "User", icon: User, path: "/profile" },
  ];

  // Don't show nav on auth pages
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 flex justify-around py-3 px-2 z-50">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <Link key={tab.name} href={tab.path} className={`flex flex-col items-center gap-1 ${isActive ? "text-emerald-600" : "text-gray-400"}`}>
            <tab.icon size={20} />
            <span className="text-[10px] font-medium">{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
}