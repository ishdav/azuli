"use client";
import { useApp, PLANS_CATALOG } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import AppMenu from "@/components/AppMenu";
import Loader from "@/components/Loader";
import { 
  ArrowUpRight, ArrowDownLeft, Activity, 
  ChevronRight, Gift, TrendingUp
} from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, YAxis } from "recharts";

export default function HomePage() {
  const { user, isLoaded } = useApp();
  const router = useRouter();

  // 1. ALL HOOKS MUST COME FIRST (Before any return statements)
  useEffect(() => {
    if (isLoaded && !user) router.push("/");
  }, [user, isLoaded, router]);

  const chartData = useMemo(() => {
    if (!user) return [];
    const base = user.totalYield > 0 ? user.totalYield / 30 : 1000; 
    return [
      { day: "Mon", amount: base * 0.8 },
      { day: "Tue", amount: base * 1.1 },
      { day: "Wed", amount: base * 0.9 },
      { day: "Thu", amount: base * 1.3 },
      { day: "Fri", amount: base * 1.2 },
      { day: "Sat", amount: base * 1.5 },
      { day: "Sun", amount: base * 1.8 },
    ];
  }, [user]);

  // 2. CONDITIONAL RETURNS COME AFTER HOOKS
  if (!isLoaded) {
    return <Loader message="Syncing portfolio..." />;
  }

  if (!user) return null;

  const recentTransactions = user.transactions?.slice(-3).reverse() || [];
  const activeNodes = user.nodes?.slice(0, 3) || [];

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen">
      
      <Header 
        title="Dashboard" 
        rightAction={<AppMenu />} 
      />

      <main className="p-5 space-y-8 pb-12">
        
        {/* 1. Hero Balance Card (Light Luxury) */}
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-50 p-7 shadow-xl shadow-slate-200/50 border border-slate-200/80">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-200/40 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-[0.2em]">
                Total Portfolio Value
              </p>
              <span className="text-[10px] text-slate-600 font-medium flex items-center gap-1.5 bg-white shadow-sm border border-slate-100 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-6 mt-1">
              <h1 className="text-5xl font-medium tracking-tight text-slate-900">
                {user.balance.toLocaleString()}
              </h1>
              <span className="text-slate-400 font-medium text-xs tracking-[0.2em] uppercase">RWF</span>
            </div>
            
            <div className="flex items-center gap-2 mb-8">
              <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                <TrendingUp size={12} /> +12.5% <span className="text-slate-400 font-normal ml-1">this week</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => router.push("/recharge")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 shadow-lg shadow-indigo-600/20 transition-all duration-300 font-medium tracking-wide"
              >
                Deposit
              </Button>
              <Button 
                onClick={() => router.push("/withdraw")}
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-12 shadow-lg shadow-rose-600/20 transition-all duration-300 font-semibold tracking-wide"
              >
                Withdraw
              </Button>
            </div>
          </div>
        </div>

        {/* 2. Horizontal Scroll Yield Nodes */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Popular Yield Nodes</h3>
              <p className="text-xs text-slate-500">Invest and earn daily</p>
            </div>
            <button 
              className="text-indigo-600 text-xs font-bold flex items-center bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
              onClick={() => router.push("/plans")}
            >
              View All <ChevronRight size={14} className="ml-1" />
            </button>
          </div>
          
          {/* Removed bg-gray-100 so the background matches the page */}
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory premium-scrollbar">
              {PLANS_CATALOG.map((plan) => (
                <div 
                  key={plan.id} 
                  className="min-w-[260px] snap-center bg-white rounded-2xl p-4 shadow-sm border border-slate-100 cursor-pointer group hover:shadow-md transition-all"
                  onClick={() => router.push(`/plans/${plan.id}`)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100">
                      <img src={plan.image} alt={plan.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{plan.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{plan.duration} Day Cycle</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Price</p>
                      <p className="font-bold text-sm text-slate-900">{plan.price.toLocaleString()} RWF</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-emerald-500 uppercase font-bold tracking-wider">Daily Yield</p>
                      <p className="font-bold text-sm text-emerald-600">+{plan.dailyYield.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="absolute top-0 right-0 bottom-3 w-12 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* 3. Performance Chart */}
        <Card className="p-5 border-none shadow-sm bg-white rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Yield Performance</h3>
              <p className="text-[10px] text-slate-500">Last 7 days</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              +{(user.totalYield || 0).toLocaleString()} RWF
            </span>
          </div>
          
          <div className="h-40 w-full -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${Math.round(value)} RWF`, 'Yield']}
                />
                <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorYield)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 4. Referral Banner */}
        <div 
          onClick={() => router.push("/team")}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 p-5 shadow-lg shadow-emerald-600/20 cursor-pointer group"
        >
          <div className="absolute right-0 top-0 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Gift size={100} />
          </div>
          <div className="relative z-10">
            <h3 className="text-white font-bold text-lg">Invite & Earn</h3>
            <p className="text-emerald-100 text-xs mt-1 mb-4">Get 2,500 RWF for every friend you invite to Azuli.</p>
            <span className="bg-white text-emerald-700 text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center">
              Invite Now <ChevronRight size={14} className="ml-1" />
            </span>
          </div>
        </div>

        {/* 5. Active Nodes */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-bold text-slate-900 text-base">Active Nodes</h3>
            <button 
              className="text-indigo-600 text-xs font-bold flex items-center bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
              onClick={() => router.push("/profile")}
            >
              Portfolio <ChevronRight size={14} className="ml-1" />
            </button>
          </div>
          
          <div className="space-y-3">
            {activeNodes.length > 0 ? (
              activeNodes.map((node) => (
                <Card key={node.id} className="p-4 border-none shadow-sm bg-white rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
                    <Activity size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-sm text-slate-900">{node.name}</h4>
                      <span className="text-xs font-bold text-emerald-600">+{node.dailyYield.toLocaleString()}/d</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-6 text-center border-none shadow-sm bg-white rounded-2xl">
                <p className="text-sm text-slate-500 mb-3">You don't have any active nodes.</p>
                <Button onClick={() => router.push("/plans")} className="bg-indigo-600 text-white rounded-xl text-xs h-9">
                  Explore Yield Nodes
                </Button>
              </Card>
            )}
          </div>
        </div>

        {/* 6. Recent Activity */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-bold text-slate-900 text-base">Recent Activity</h3>
            <button 
              className="text-slate-500 text-xs font-medium hover:text-indigo-600 transition-colors"
              onClick={() => router.push("/history")}
            >
              See All
            </button>
          </div>
          
          <div className="space-y-2">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.amount < 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {tx.amount < 0 ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{tx.type}</p>
                      <p className="text-[10px] text-slate-400">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`text-xs font-bold ${tx.amount < 0 ? 'text-slate-900' : 'text-emerald-600'}`}>
                    {tx.amount < 0 ? '' : '+'}{tx.amount.toLocaleString()} RWF
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No recent activity.</p>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}