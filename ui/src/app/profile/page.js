"use client";
import { useApp, EQUIPMENT_CATALOG } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  Menu,
  TrendingUp,
  Cpu,
  Lightbulb,
  FileText,
  Sun,
  ArrowRight,
} from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts";
import AppMenu from "@/components/AppMenu";
import Logo from "../../../public/logo.png";

export default function ProfilePage() {
  const { user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/");
  }, [user, router]);

  // 7-bar chart data
  const chartData = useMemo(() => {
    if (!user) return [];
    const dailyTotal = user.equipment.reduce(
      (sum, eq) => sum + eq.dailyEarning,
      0
    );
    const base = dailyTotal || 1000;
    return [
      { v: base * 0.35 },
      { v: base * 0.55 },
      { v: base * 0.7 },
      { v: base * 0.65 },
      { v: base * 0.85 },
      { v: base * 0.75 },
      { v: base * 1.0 },
    ];
  }, [user]);

  if (!user) return null;

  const hasDevices = user.equipment.length > 0;

  return (
    <div className="p-4 space-y-5 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mt-2">
        <AppMenu />
        <h1 className="text-base font-semibold">User details</h1>
        <div className="w-9 h-9 rounded-md overflow-hidden border border-gray-100">
          <img
            src={Logo.src}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Balance Card with Chart */}
      <Card className="p-5 pb-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-gray-500 font-medium">
              Account Balance
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">
              {user.balance.toLocaleString()}
            </h2>
            <div className="flex items-center gap-1 mt-1 text-emerald-600">
              <TrendingUp size={12} />
              <span className="text-xs font-medium">
                +{user.totalEarnings.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <Button
              onClick={() => router.push("/recharge")}
              className="h-9 px-5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
            >
              Recharge
            </Button>
            <Button
              onClick={() => router.push("/withdraw")}
              variant="outline"
              className="h-9 px-5 rounded-full border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-50"
            >
              Withdraw
            </Button>
          </div>
        </div>

        {/* Chart */}
        <div className="h-20 mt-4 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="20%">
              <Bar dataKey="v" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      i === chartData.length - 1 ? "#10b981" : "#d1fae5"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Two Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <p className="text-xs text-gray-500 font-medium">Equipment</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">
            {user.equipment.length}
          </h3>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-500 font-medium">Total earnings</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">
            {user.totalEarnings.toLocaleString()}
          </h3>
        </Card>
      </div>

      {/* Need Help Card */}
      <Card className="relative overflow-hidden p-5 border-none bg-gradient-to-br from-emerald-700 to-emerald-800">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
          <div className="w-16 h-16 rounded-full border-2 border-white/40 flex items-center justify-center">
            <Lightbulb size={28} className="text-white" />
          </div>
        </div>

        <div className="relative">
          <h3 className="text-lg font-bold text-white">Need Help?</h3>
          <Button
            onClick={() => router.push("/contact")}
            className="mt-3 bg-white/15 hover:bg-white/25 backdrop-blur text-white border-none rounded-full h-9 px-5 text-xs font-bold"
          >
            Contact Expert
          </Button>
        </div>
      </Card>

      {/* My Device Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-emerald-600" />
            <h3 className="font-bold text-gray-800 text-sm">My device</h3>
          </div>
          <span
            className="text-emerald-600 text-xs font-medium cursor-pointer"
            onClick={() => router.push("/equipment")}
          >
            Acquire equipment
          </span>
        </div>

        <Card className="overflow-hidden p-0">
          {/* Table Header */}
          <div className="grid grid-cols-3 px-4 py-3 bg-gray-50 border-b border-gray-100 text-[11px] font-medium text-gray-500">
            <span>Type</span>
            <span className="text-center">Status</span>
            <span className="text-right">Income</span>
          </div>

          {/* Table Body */}
          {hasDevices ? (
            user.equipment.slice(0, 3).map((eq) => (
              <div
                key={eq.id}
                className="grid grid-cols-3 px-4 py-4 border-b border-gray-50 last:border-0 items-center"
              >
                <span className="text-xs font-medium text-gray-800 truncate pr-2">
                  {eq.name}
                </span>
                <div className="flex justify-center">
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold">
                    {eq.status}
                  </span>
                </div>
                <span className="text-xs font-bold text-gray-800 text-right">
                  {eq.dailyEarning.toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-xs text-gray-400">
              No active devices yet
            </div>
          )}
        </Card>
      </div>

      {/* Account Settings Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sun size={16} className="text-emerald-600" />
          <h3 className="font-bold text-gray-800 text-sm">
            Account Settings
          </h3>
        </div>

        <Card className="p-0 overflow-hidden">
          <div
            onClick={() => router.push("/history")}
            className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-emerald-50 flex items-center justify-center">
                <FileText size={16} className="text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-800">Records</p>
                <p className="text-[11px] text-gray-500">
                  View transaction history
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-gray-300" />
          </div>
        </Card>
      </div>
    </div>
  );
}