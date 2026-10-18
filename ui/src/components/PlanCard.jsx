"use client";
import { Card } from "@/components/ui/card";
import { ChevronRight, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PlanCard({ plan }) {
  const router = useRouter();
  const totalEarnings = plan.dailyYield * plan.duration;

  return (
    <Card 
      // Increased height to h-52 (208px) for a more spacious premium look
      className="flex flex-row h-52 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-white cursor-pointer hover:shadow-md transition-all group"
      onClick={() => router.push(`/plans/${plan.id}`)}
    >
      {/* Left Side: Full height image taking exactly 50% width */}
      <div className="w-1/2 h-full relative bg-slate-100 overflow-hidden">
        <img 
          src={plan.image} 
          alt={plan.name} 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5"></div>
      </div>
      
      {/* Right Side: Content taking 50% width */}
      <div className="w-1/2 p-4 flex flex-col justify-between">
        
        {/* Top: Title and Badge */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-1 pr-1">
              {plan.name}
            </h3>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors flex-shrink-0 mt-0.5" />
          </div>
          {plan.badge && (
            <span className={`text-[9px] w-fit font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
              plan.badge === 'Most Popular' ? "bg-indigo-50 text-indigo-600" : 
              plan.badge === 'VIP Exclusive' ? "bg-amber-50 text-amber-600" : 
              "bg-slate-100 text-slate-600"
            }`}>
              {plan.badge}
            </span>
          )}
        </div>

        {/* Middle: Stacked Stats */}
        <div className="flex flex-col gap-1.5 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price</span>
            <span className="text-xs font-bold text-slate-900">{plan.price.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Daily</span>
            <span className="text-xs font-bold text-emerald-600">+{plan.dailyYield.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center border-t border-slate-100 pt-1.5 mt-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Earnings</span>
            <span className="text-xs font-bold text-indigo-600">{totalEarnings.toLocaleString()}</span>
          </div>
        </div>

        {/* Bottom: Call to Action Button (Slightly taller to match new card height) */}
        <button 
          className="w-full mt-auto h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg shadow-sm shadow-indigo-600/30 transition-all duration-300 flex items-center justify-center gap-1.5 flex-shrink-0"
        >
          <Zap size={13} className="fill-white" /> Invest Now
        </button>

      </div>
    </Card>
  );
}