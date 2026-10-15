"use client";
import { useApp, EQUIPMENT_CATALOG } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Cpu, Wallet, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user } = useApp();
  const router = useRouter();

  if (!user) return <div className="p-6 text-center mt-20">Please <span className="text-emerald-600 font-bold" onClick={() => router.push("/login")}>Login</span> or <span className="text-emerald-600 font-bold" onClick={() => router.push("/register")}>Register</span></div>;

  const chartData = [
    { name: 'Mon', val: 100 }, { name: 'Tue', val: 200 }, { name: 'Wed', val: 150 },
    { name: 'Thu', val: 300 }, { name: 'Fri', val: 250 }, { name: 'Sat', val: 400 }, { name: 'Sun', val: 350 }
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center mt-4">
        <h1 className="text-xl font-bold">Home</h1>
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
          {user.phone.slice(-2)}
        </div>
      </div>

      <Card className="p-6 bg-gradient-to-br from-emerald-50 to-white shadow-sm border-emerald-100">
        <p className="text-sm text-gray-500">ACCOUNT BALANCE</p>
        <div className="flex items-end gap-3 mt-1">
          <h2 className="text-4xl font-bold text-gray-900">{user.balance.toFixed(2)}</h2>
          <span className="text-emerald-600 text-sm font-medium mb-1">RWF</span>
        </div>
        <div className="h-16 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <Bar dataKey="val" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Button onClick={() => router.push("/equipment")} className="h-14 bg-emerald-800 hover:bg-emerald-900 text-white">
          <Cpu className="mr-2" size={18} /> Acquire equipment
        </Button>
        <Button onClick={() => router.push("/recharge")} variant="outline" className="h-14 border-emerald-200 text-emerald-800 hover:bg-emerald-50">
          <Wallet className="mr-2" size={18} /> Recharge
        </Button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Popular AI computing equipment</h3>
          <span className="text-emerald-600 text-sm font-medium">See All</span>
        </div>
        <div className="space-y-3">
          {EQUIPMENT_CATALOG.slice(0, 3).map((eq) => (
            <Card key={eq.id} className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50" onClick={() => router.push(`/equipment/${eq.id}`)}>
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden">
                  {/* Replace with actual image */}
                  <img src={eq.image} alt={eq.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{eq.name}</h4>
                  <p className="text-xs text-gray-500">150 Day Cycle</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">{eq.price} RWF</p>
                <p className="text-xs text-emerald-600">+{eq.dailyEarning} RWF/Day</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}