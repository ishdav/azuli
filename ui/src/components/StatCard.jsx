"use client";
import { Card } from "@/components/ui/card";

export default function StatCard({ label, value, suffix, icon: Icon, color = "indigo" }) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <Card className="p-5 border-none shadow-sm bg-white rounded-2xl">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${colorMap[color]}`}>
        {Icon && <Icon size={20} />}
      </div>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        {suffix && <span className="text-xs text-slate-400 font-medium">{suffix}</span>}
      </div>
    </Card>
  );
}