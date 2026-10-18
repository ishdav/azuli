"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { Users, Wallet, TrendingUp, Loader2, AlertTriangle, ShieldAlert, ArrowRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [killModalOpen, setKillModalOpen] = useState(false);
  const [killing, setKilling] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Promise.all([api.getAdminStats(), api.getAdminChartData()]).then(([statsData, chartData]) => {
      setStats(statsData);
      setChartData(chartData);
    });
  }, []);

  const handleKillSystem = async () => {
    setKilling(true);
    await api.killSystem();
    router.push("/admin/login");
  };

  if (!stats) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
        <p className="text-slate-500 mt-1">Platform metrics, transaction volume, and global controls.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminStatCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon={Users} color="indigo" trend="+12%" />
        <AdminStatCard title="Platform Balance" value={stats.totalBalance.toLocaleString()} suffix="RWF" icon={Wallet} color="emerald" trend="+8.4%" />
        <AdminStatCard title="Total Value Staked" value={stats.totalStaked.toLocaleString()} suffix="RWF" icon={TrendingUp} color="amber" trend="+15%" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="p-6 border-slate-200 shadow-sm rounded-2xl bg-white">
          <div className="mb-6">
            <h3 className="font-bold text-slate-900 text-lg">User Growth</h3>
            <p className="text-xs text-slate-500 font-medium">Daily registrations over the last 7 days</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 600 }} 
                />
                <Area type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={3} fill="url(#colorUsers)" activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Transaction Volume Chart */}
        <Card className="p-6 border-slate-200 shadow-sm rounded-2xl bg-white">
          <div className="mb-6">
            <h3 className="font-bold text-slate-900 text-lg">Transaction Volume</h3>
            <p className="text-xs text-slate-500 font-medium">Total RWF processed daily</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 600 }} 
                />
                <Bar dataKey="volume" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 🚨 DANGER ZONE 🚨 */}
      <div className="mt-12">
        <Card className="border-rose-200 bg-white shadow-xl shadow-rose-100/50 rounded-3xl overflow-hidden relative">
          {/* Decorative red gradient top border */}
          <div className="h-1 w-full bg-gradient-to-r from-rose-400 via-rose-600 to-rose-400"></div>
          
          <div className="p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center flex-shrink-0 border border-rose-100">
                <ShieldAlert className="text-rose-600" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Kill System / Reset Platform
                </h3>
                <p className="text-slate-500 text-sm mt-2 max-w-xl leading-relaxed">
                  This action is <strong className="text-rose-600 font-bold">irreversible</strong>. Executing this will permanently wipe all users, balances, transactions, and nodes. The platform will reset to factory defaults and all sessions will be terminated.
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => setKillModalOpen(true)}
              className="w-full md:w-auto bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-rose-600/20 whitespace-nowrap flex-shrink-0"
            >
              Execute Wipe <ArrowRight className="ml-2" size={18} />
            </Button>
          </div>
        </Card>
      </div>

      {/* Kill System Confirmation Modal */}
      <Dialog open={killModalOpen} onOpenChange={setKillModalOpen}>
        <DialogContent className="sm:max-w-md border-rose-200 rounded-2xl p-6">
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
              <AlertTriangle className="text-rose-600" size={24} />
            </div>
            <DialogTitle className="text-xl text-slate-900">Are you absolutely sure?</DialogTitle>
            <DialogDescription className="text-slate-600 pt-2 text-base">
              This will <strong className="text-rose-600">permanently delete</strong> all data across the entire platform. There is no going back.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-3 sm:justify-start">
            <Button variant="outline" onClick={() => setKillModalOpen(false)} disabled={killing} className="rounded-xl flex-1 h-11 border-slate-300">
              Cancel
            </Button>
            <Button onClick={handleKillSystem} disabled={killing} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl flex-1 h-11 shadow-lg shadow-rose-600/20">
              {killing ? <><Loader2 className="mr-2 animate-spin" size={18} /> Wiping...</> : "Yes, Wipe Data"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}