"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, Calendar, Zap, TrendingUp } from "lucide-react";

export default function CheckInPage() {
  const { user, checkIn, isLoaded } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!isLoaded || !user) return null;

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await checkIn();
      alert("Check-in successful! 200 RWF added to your balance.");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toDateString();
  const hasCheckedIn = user?.lastCheckIn && new Date(user.lastCheckIn).toDateString() === today;

  return (
    <div className="p-4 space-y-4 pb-24 animate-fade-in bg-slate-50 min-h-screen">
      <div className="flex items-center gap-3 mt-4 mb-6">
        <ArrowLeft size={20} className="cursor-pointer text-slate-700" onClick={() => router.back()} />
        <h1 className="text-xl font-bold text-slate-900">Daily Check-in</h1>
      </div>

      {/* ✅ EXACT MATCH OF HOME PAGE HERO CARD */}
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-50 p-7 shadow-xl shadow-slate-200/50 border border-slate-200/80">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-200/40 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-[0.2em]">
              Daily Reward
            </p>
            <span className="text-[10px] text-slate-600 font-medium flex items-center gap-1.5 bg-white shadow-sm border border-slate-100 px-2.5 py-1 rounded-full">
              <span className={`w-1.5 h-1.5 rounded-full ${hasCheckedIn ? 'bg-slate-400' : 'bg-emerald-500 animate-pulse'}`}></span> 
              {hasCheckedIn ? 'Completed' : 'Available'}
            </span>
          </div>
          
          <div className="flex items-baseline gap-2 mb-6 mt-1">
            <h1 className="text-5xl font-medium tracking-tight text-slate-900">
              200
            </h1>
            <span className="text-slate-400 font-medium text-xs tracking-[0.2em] uppercase">RWF</span>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
              <TrendingUp size={12} /> <span className="text-slate-400 font-normal ml-1">Added to your balance instantly</span>
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5 border-none shadow-sm bg-white rounded-2xl flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mb-2">
            <Zap size={16} className="text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">{user.totalYield?.toLocaleString() || 0}</h3>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">Total Yield</p>
        </Card>
        <Card className="p-5 border-none shadow-sm bg-white rounded-2xl flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">{hasCheckedIn ? "Done" : "Ready"}</h3>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">Today's Status</p>
        </Card>
      </div>

      {/* Action Button */}
      <Button
        onClick={handleCheckIn}
        disabled={hasCheckedIn || loading}
        className={`w-full py-7 text-base font-bold rounded-2xl transition-all duration-300 ${
          hasCheckedIn 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30'
        }`}
      >
        {loading ? (
          <><Loader2 className="mr-2 animate-spin" size={20} /> Processing...</>
        ) : hasCheckedIn ? (
          "ALREADY CHECKED IN TODAY"
        ) : (
          "CLAIM 200 RWF NOW"
        )}
      </Button>

      {/* Rules Card */}
      <Card className="p-5 border-slate-100 shadow-sm bg-white rounded-2xl space-y-4 mt-6">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-indigo-600" /> Check-in Rules
        </h3>
        <ul className="text-xs text-slate-600 space-y-3">
          <li className="flex gap-3">
            <span className="font-bold text-slate-400">01</span> 
            <span>Rewards are credited instantly to your available balance.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-slate-400">02</span> 
            <span>The check-in timer resets automatically at 00:00 UTC daily.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-slate-400">03</span> 
            <span>Each account is limited to one check-in per 24-hour cycle.</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}