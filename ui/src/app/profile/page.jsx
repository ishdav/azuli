"use client";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PLANS_CATALOG } from "@/services/api";
import Header from "@/components/Header";
import NodeCard from "@/components/NodeCard";
import { Card } from "@/components/ui/card";
import { 
  Activity, ShieldCheck, LogOut, ChevronRight, 
  Settings, FileText, Zap, Users, CalendarCheck
} from "lucide-react";

export default function ProfilePage() {
  const { user, isLoaded, logout } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) router.push("/");
  }, [user, isLoaded, router]);

  if (!isLoaded || !user) return null;

  const totalStaked = user.nodes?.reduce((sum, n) => sum + n.buyPrice, 0) || 0;

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen pb-32">
      <Header 
        title="Portfolio" 
        rightAction={
          <button onClick={() => { logout(); router.push("/"); }} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
            <LogOut size={20} />
          </button>
        }
      />
      
      <main className="p-4 space-y-6">
        {/* User Card */}
        <Card className="p-6 border-none shadow-sm bg-white rounded-3xl flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-500/30">
            {user.phone.slice(-2)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">+{user.phone}</h2>
            <p className="text-xs text-slate-500 mt-1">Invite Code: <span className="font-bold text-indigo-600">{user.inviteCode}</span></p>
          </div>
        </Card>

        {/* NEW: Quick Actions Grid Moved from Home */}
        <div>
          <h3 className="font-bold text-slate-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Invest", icon: Zap, path: "/plans", color: "bg-indigo-50 text-indigo-600" },
              { label: "Team", icon: Users, path: "/team", color: "bg-amber-50 text-amber-600" },
              { label: "Check-in", icon: CalendarCheck, path: "/checkin", color: "bg-emerald-50 text-emerald-600" },
              { label: "Support", icon: ShieldCheck, path: "/contact", color: "bg-slate-100 text-slate-600" },
            ].map((action) => (
              <button 
                key={action.label}
                onClick={() => router.push(action.path)}
                className="flex flex-col items-center gap-2 bg-white p-3 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                  <action.icon size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center border-none shadow-sm bg-white rounded-2xl">
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Staked</p>
            <p className="text-sm font-bold text-slate-900">{totalStaked > 999 ? `${(totalStaked/1000).toFixed(0)}k` : totalStaked}</p>
          </Card>
          <Card className="p-3 text-center border-none shadow-sm bg-white rounded-2xl">
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Nodes</p>
            <p className="text-sm font-bold text-slate-900">{user.nodes?.length || 0}</p>
          </Card>
          <Card className="p-3 text-center border-none shadow-sm bg-white rounded-2xl">
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Yield</p>
            <p className="text-sm font-bold text-emerald-600">{user.totalYield > 999 ? `${(user.totalYield/1000).toFixed(1)}k` : user.totalYield}</p>
          </Card>
        </div>

        {/* My Nodes */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-slate-900">Active Nodes</h3>
            <span onClick={() => router.push("/plans")} className="text-xs font-bold text-indigo-600 cursor-pointer flex items-center">
              Acquire <ChevronRight size={14} />
            </span>
          </div>
          
          <div className="space-y-3">
            {user.nodes?.length > 0 ? (
              user.nodes.map(node => {
                const catalogItem = PLANS_CATALOG.find(p => p.id === node.planId);
                return <NodeCard key={node.id} node={node} catalogItem={catalogItem} />;
              })
            ) : (
              <Card className="p-8 text-center border-none shadow-sm bg-white rounded-2xl text-slate-400 text-sm">
                No active nodes. Acquire one to start earning.
              </Card>
            )}
          </div>
        </div>

        {/* Settings */}
        <div>
          <h3 className="font-bold text-slate-900 mb-3">Settings</h3>
          <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
            <div onClick={() => router.push("/history")} className="flex items-center justify-between p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><FileText size={16} /></div>
                <span className="text-sm font-medium text-slate-900">Transaction History</span>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
            <div onClick={() => router.push("/contact")} className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600"><Settings size={16} /></div>
                <span className="text-sm font-medium text-slate-900">Support Center</span>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}