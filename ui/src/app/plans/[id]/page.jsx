"use client";
import { useApp } from "@/context/AppContext";
import { useRouter, useParams } from "next/navigation";
import { useState, Suspense } from "react";
import { PLANS_CATALOG } from "@/services/api";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, ShieldCheck, TrendingUp, Loader2 } from "lucide-react";

function PlanDetailContent() {
  const { id } = useParams();
  const { user, purchasePlan, isLoaded } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const plan = PLANS_CATALOG.find((p) => p.id === id);

  if (!isLoaded || !user || !plan) return null;

  const canAfford = user.balance >= plan.price;

  const handlePurchase = async () => {
    setLoading(true);
    try {
      await purchasePlan(plan.id);
      alert("Node acquired successfully!");
      router.push("/profile");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen pb-32">
      <Header title="Investment Details" showBack />
      <main className="p-4 space-y-4">
        
        <div className="w-full h-56 rounded-3xl overflow-hidden bg-slate-200 mb-6 relative">
          <img src={plan.image} alt={plan.name} className="w-full h-full object-cover" />
        </div>

        <Card className="p-6 border-none shadow-sm bg-white rounded-3xl">
          <h2 className="text-2xl font-bold text-slate-900">{plan.name}</h2>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
            <Zap size={14} className="text-amber-500" /> {plan.duration} Day Cycle
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Daily Yield</p>
              <p className="text-lg font-bold text-emerald-600">+{plan.dailyYield.toLocaleString()} RWF</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Return</p>
              <p className="text-lg font-bold text-slate-900">{(plan.dailyYield * plan.duration).toLocaleString()} RWF</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Node Price</span>
              <span className="font-bold text-slate-900">{plan.price.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Your Balance</span>
              <span className={`font-bold ${canAfford ? 'text-slate-900' : 'text-rose-500'}`}>
                {user.balance.toLocaleString()} RWF
              </span>
            </div>
          </div>

          <Button 
            onClick={handlePurchase}
            disabled={loading || !canAfford}
            className={`w-full h-14 rounded-2xl mt-6 text-base font-bold transition-all ${
              canAfford 
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : canAfford ? "Acquire Node" : "Insufficient Balance"}
          </Button>
        </Card>
      </main>
    </div>
  );
}

export default function PlanDetail() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>}>
      <PlanDetailContent />
    </Suspense>
  );
}