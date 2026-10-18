"use client";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Copy, CheckCircle2, Users, Gift, TrendingUp, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Loader from "@/components/Loader";

export default function TeamPage() {
  const { user, isLoaded, getDownlines } = useApp();
  const router = useRouter();
  const [downlines, setDownlines] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) router.push("/");
  }, [user, isLoaded, router]);

  useEffect(() => {
    if (user) {
      setDownlines(getDownlines());
    }
  }, [user, getDownlines]);

  const copyCode = useCallback(() => {
    if (!user) return;
    navigator.clipboard.writeText(user.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [user]);

  if (!isLoaded) {
    return <Loader message="Loading your network..." />;
  }

  if (!user) return null;

  const directInvites = downlines.filter((d) => d.invitedBy === user.id);
  const totalBonus = directInvites.length * 2500;

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen pb-24">
      
      <Header title="My Team" />

      <main className="p-5 space-y-6">
        
        {/* Invitation Code Card (Light Luxury - Matches Home Hero Card) */}
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-50 p-7 shadow-xl shadow-slate-200/50 border border-slate-200/80">
          {/* Subtle, soft ambient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-200/40 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-1.5">
                <Gift size={12} className="text-slate-500" />
                <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-[0.2em]">
                  Your Invitation Code
                </p>
              </div>
              
              {/* Minimalist Copy Button */}
              <button 
                onClick={copyCode}
                className="text-[10px] text-slate-600 font-medium flex items-center gap-1.5 bg-white shadow-sm border border-slate-100 px-2.5 py-1 rounded-full hover:bg-slate-50 transition-colors"
              >
                {copied ? (
                  <><CheckCircle2 size={12} className="text-emerald-500" /> Copied</>
                ) : (
                  <><Copy size={12} /> Copy</>
                )}
              </button>
            </div>
            
            <div className="flex items-baseline gap-2 mb-6 mt-1">
              <h1 className="text-4xl font-medium tracking-tight text-slate-900">
                {user.inviteCode}
              </h1>
            </div>

            {/* Info Banner inside card */}
            <div className="flex items-start gap-2 text-[11px] text-slate-600 bg-white shadow-sm border border-slate-100 px-3 py-2.5 rounded-xl">
              <TrendingUp size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <p>
                Earn <strong className="text-slate-900">2,500 RWF</strong> per direct invite, and <strong className="text-slate-900">300 RWF</strong> when they invite someone else.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Summary Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5 border-none shadow-sm bg-white rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mb-3">
              <Users size={20} className="text-indigo-600" />
            </div>
            <p className="text-xs text-slate-500 font-medium">Total Downlines</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {downlines.length}
            </h3>
          </Card>
          
          <Card className="p-5 border-none shadow-sm bg-white rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
              <ShieldCheck size={20} className="text-emerald-600" />
            </div>
            <p className="text-xs text-slate-500 font-medium">Referral Bonus</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              {totalBonus.toLocaleString()} <span className="text-xs font-medium text-slate-400">RWF</span>
            </h3>
          </Card>
        </div>

        {/* Downlines List */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-bold text-slate-900 text-lg">My Network</h3>
            <span className="text-[10px] bg-slate-200 text-slate-600 px-2.5 py-1 rounded-md font-bold">
              {downlines.length} Users
            </span>
          </div>

          {downlines.length === 0 ? (
            <Card className="p-8 text-center flex flex-col items-center border-none shadow-sm bg-white rounded-3xl">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                <Users size={28} className="text-indigo-600" />
              </div>
              <p className="text-slate-900 font-bold">No referrals yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                Share your code with friends to start building your network and earning rewards.
              </p>
              <Button
                onClick={copyCode}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 text-xs font-bold shadow-lg shadow-indigo-600/20"
              >
                {copied ? "Code Copied!" : "Copy Invitation Code"}
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {downlines.map((downline) => (
                <Card
                  key={downline.id}
                  className="p-4 flex justify-between items-center border-none shadow-sm bg-white rounded-2xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
                      {downline.phone.slice(-2)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">
                        +{downline.phone}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Joined recently
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg">
                    +2,500 RWF
                  </span>
                </Card>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}