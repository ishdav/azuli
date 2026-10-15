"use client";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Cpu, History, Wallet, LogOut, Users } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useApp();
  const router = useRouter();

  if (!user) return null;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mt-4 mb-2">
        <h1 className="text-xl font-bold">User details</h1>
        <LogOut size={20} className="text-gray-400 cursor-pointer" onClick={() => { logout(); router.push("/login"); }} />
      </div>

      {/* Account Balance Card */}
      <Card className="p-5 bg-gradient-to-br from-emerald-50 to-white shadow-sm border-emerald-100">
        <p className="text-xs text-gray-500 font-medium">Account Balance</p>
        <div className="flex justify-between items-center mt-1">
          <h2 className="text-3xl font-bold">{user.balance.toFixed(2)} RWF</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-700" onClick={() => router.push("/recharge")}>Recharge</Button>
            <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white" onClick={() => router.push("/withdraw")}>Withdraw</Button>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-xs text-gray-500">Equipment</p>
          <h3 className="text-xl font-bold mt-1">{user.equipment.length}</h3>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-500">Total earnings</p>
          <h3 className="text-xl font-bold mt-1 text-emerald-600">{user.totalEarnings.toFixed(2)}</h3>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-12 justify-start text-sm" onClick={() => router.push("/history")}>
          <History size={16} className="mr-2 text-emerald-600" /> History
        </Button>
        <Button variant="outline" className="h-12 justify-start text-sm" onClick={() => router.push("/team")}>
          <Users size={16} className="mr-2 text-emerald-600" /> My Team
        </Button>
      </div>

      {/* My Devices */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">My device</h3>
        {user.equipment.length === 0 ? (
          <Card className="p-6 text-center text-gray-500 text-sm">
            No active devices. <span className="text-emerald-600 cursor-pointer" onClick={() => router.push("/equipment")}>Acquire one now</span>
          </Card>
        ) : (
          <div className="space-y-4">
            {user.equipment.map((eq) => {
              // Calculate ROI: (Total Earnings / Buy Price) * 100
              // Note: We don't have an individual totalEarnings per equipment yet, 
              // so we will estimate it based on days passed or just use a placeholder if not stored.
              // For this demo, let's assume totalEarnings for this specific eq is calculated or stored.
              // Let's estimate ROI based on the daily earning * 150 days / price
              const maxEarnings = eq.dailyEarning * 150;
              const roi = ((maxEarnings / eq.buyPrice) * 100).toFixed(0);

              return (
                <Card key={eq.id} className="overflow-hidden">
                  <div className="h-32 bg-gray-200 w-full">
                    <img src={EQUIPMENT_CATALOG.find(e => e.id === eq.equipmentId)?.image} alt={eq.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold">{eq.name}</h4>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">ROI {roi}%</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{eq.buyPrice} RWF · 150 Day</span>
                      <span className="text-emerald-600 font-medium">+{eq.dailyEarning} RWF/day</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t text-sm">
                      <span className="text-gray-500">Status</span>
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {eq.status}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}