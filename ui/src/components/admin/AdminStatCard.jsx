"use client";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function AdminStatCard({ title, value, icon: Icon, color = "indigo", suffix, trend }) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <Card className="p-6 bg-white border-slate-200 shadow-sm rounded-2xl relative overflow-hidden group hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{title}</p>
          <div className="flex items-baseline gap-1 mt-2">
            <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
            {suffix && <span className="text-xs font-bold text-slate-400">{suffix}</span>}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color]} shadow-sm`}>
          <Icon size={24} />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1">
            <TrendingUp size={12} /> {trend}
          </span>
          <span className="text-xs text-slate-400 font-medium">vs last week</span>
        </div>
      )}
    </Card>
  );
}