"use client";
import { useApp } from "@/context/AppContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import PlanCard from "@/components/PlanCard";
import { PLANS_CATALOG } from "@/services/api";
import { Card } from "@/components/ui/card";
import Loader from "@/components/Loader";

export default function PlansPage() {
  const { user, isLoaded } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) router.push("/");
  }, [user, isLoaded, router]);

  // SPINNING LOADER STATE (Replaced Skeleton)
  if (!isLoaded) {
    return <Loader message="Loading Yield Nodes..." />;
  }

  if (!user) return null;

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen pb-12">
      <Header title="Yield Nodes" />
      
      <main className="p-5 space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Available Nodes</h2>
          <p className="text-sm text-slate-500 mt-1">Select a tier to start generating daily yield.</p>
        </div>

        {/* Gray-White Luxury Info Banner */}
        <Card className="relative overflow-hidden rounded-[2rem] bg-slate-50 p-6 border border-slate-200/80 shadow-xl shadow-slate-200/50">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-200/40 to-transparent rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Available Balance</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-3xl font-medium text-slate-900">{user.balance.toLocaleString()}</h3>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">RWF</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Active Nodes</p>
              <h3 className="text-3xl font-light text-emerald-600">{user.nodes?.length || 0}</h3>
            </div>
          </div>
        </Card>

        {/* Nodes List */}
        <div className="space-y-6">
          {PLANS_CATALOG.map((plan, index) => (
            <div key={plan.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              <PlanCard plan={plan} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}