"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Cpu, Users, User } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useApp();

  // Hide the nav if the user is not logged in
  if (!user) return null;

  const tabs = [
    { name: "Home", icon: Home, path: "/home" },
    { name: "Equipment", icon: Cpu, path: "/equipment" },
    { name: "Team", icon: Users, path: "/team" },
    { name: "User", icon: User, path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 flex justify-around py-3 px-2 z-50">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <Link
            key={tab.name}
            href={tab.path}
            className={`flex flex-col items-center gap-1 ${
              isActive ? "text-emerald-600" : "text-gray-400"
            }`}
          >
            <tab.icon size={20} />
            <span className="text-[10px] font-medium">{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
}