"use client";
import { useState } from "react";
import {
  Menu,
  Home,
  Cpu,
  Smartphone,
  User,
  Headset,
  LogOut,
  History,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MenuItem from "./MenuItem";

export default function AppMenu() {
  const { user, logout } = useApp();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    logout();
    router.push("/");
  };

  const handleNavigate = (href) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="p-1">
          <Menu size={22} className="text-gray-800" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="p-6 bg-emerald-800 text-white text-left">
          <SheetTitle className="text-white text-lg">Menu</SheetTitle>
          {user && (
            <div className="mt-2">
              <p className="text-sm font-bold">{user.phone}</p>
              <p className="text-xs text-emerald-200">
                Code: {user.invitationCode}
              </p>
            </div>
          )}
        </SheetHeader>

        <div className="p-3 space-y-1">
          <MenuItem
            icon={Home}
            label="Home"
            onClick={() => handleNavigate("/home")}
          />
          <MenuItem
            icon={Cpu}
            label="Equipments"
            onClick={() => handleNavigate("/equipment")}
          />
          <MenuItem
            icon={Smartphone}
            label="My Device"
            badge={user?.equipment?.length || 0}
            onClick={() => handleNavigate("/my-device")}
          />
          <MenuItem
            icon={History}
            label="Withdrawal History"
            onClick={() => handleNavigate("/history")}
          />
          <MenuItem
            icon={User}
            label="Profile"
            onClick={() => handleNavigate("/profile")}
          />
          <MenuItem
            icon={Headset}
            label="Contact Us"
            onClick={() => handleNavigate("/contact")}
          />
          <hr className="my-2 border-gray-100" />
          <MenuItem icon={LogOut} label="Logout" danger onClick={handleLogout} />
        </div>
      </SheetContent>
    </Sheet>
  );
}