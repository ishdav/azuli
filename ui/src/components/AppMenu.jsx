"use client";
import { useState } from "react";
import {
  Menu,
  LayoutDashboard,
  Layers,
  Wallet,
  Users,
  History,
  Headset,
  LogOut,
  ChevronRight,
  Copy,
  CheckCircle2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AppMenu() {
  const { user, logout } = useApp();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    logout();
    router.push("/");
  };

  const handleNavigate = (href) => {
    setOpen(false);
    router.push(href);
  };

  const copyCode = (e) => {
    e.stopPropagation(); // Prevent closing the menu when clicking copy
    if (!user) return;
    navigator.clipboard.writeText(user.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/home" },
    { label: "Yield Nodes", icon: Layers, path: "/plans" },
    { label: "Portfolio", icon: Wallet, path: "/profile" },
    { label: "My Team", icon: Users, path: "/team" },
    { label: "History", icon: History, path: "/history" },
    { label: "Contact Support", icon: Headset, path: "/contact" },
  ];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      {/* 
        FIX: Removed asChild and the inner <button>. 
        Applied the styling directly to the Trigger component.
      */}
      <DropdownMenuTrigger className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative outline-none">
        <Menu size={22} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-64 mt-2 p-2 rounded-2xl shadow-2xl border border-slate-200 bg-white z-[100] animate-in fade-in slide-in-from-top-2 duration-200"
      >
        {/* User Profile Header with Copy Button */}
        <div className="font-normal p-3 bg-slate-50 rounded-xl mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/20">
              {user.phone.slice(-2)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">+{user.phone}</span>
              
              {/* Copy Code Button - Changed to a div with role="button" to avoid nested button issues inside the menu */}
              <div 
                onClick={copyCode}
                className="flex items-center gap-1.5 mt-0.5 cursor-pointer group/copy hover:opacity-80 transition-opacity"
              >
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider group-hover/copy:text-indigo-600">
                  Code: {user.inviteCode}
                </span>
                {copied ? (
                  <CheckCircle2 size={12} className="text-emerald-500" />
                ) : (
                  <Copy size={12} className="text-slate-400 group-hover/copy:text-indigo-600" />
                )}
              </div>
              
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        {menuItems.map((item) => (
          <DropdownMenuItem
            key={item.label}
            onClick={() => handleNavigate(item.path)}
            className="flex items-center justify-between p-3 rounded-xl cursor-pointer text-slate-700 focus:text-indigo-600 focus:bg-indigo-50 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-600 outline-none transition-colors"
          >
            <div className="flex items-center gap-3">
              <item.icon size={18} />
              <span className="text-sm font-semibold">{item.label}</span>
            </div>
            <ChevronRight size={14} className="text-slate-300" />
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="my-2 bg-slate-100" />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center justify-between p-3 rounded-xl cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50 data-[highlighted]:bg-rose-50 data-[highlighted]:text-rose-700 outline-none transition-colors"
        >
          <div className="flex items-center gap-3">
            <LogOut size={18} />
            <span className="text-sm font-semibold">Log Out</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}