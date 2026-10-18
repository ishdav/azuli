"use client";
import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function NodeCard({ node, catalogItem }) {
  const daysRunning = Math.max(
    1,
    Math.floor((Date.now() - new Date(node.purchaseDate).getTime()) / (1000 * 60 * 60 * 24))
  );
  const currentYield = daysRunning * node.dailyYield;
  const progress = Math.min((daysRunning / 150) * 100, 100);

  return (
    <Card className="p-4 border-none shadow-sm bg-white rounded-2xl">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
          <img 
            src={catalogItem?.image || "/images/placeholder.jpg"} 
            alt={node.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm text-slate-900">{node.name}</h4>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-bold flex items-center gap-1">
              <Activity size={10} /> {node.status}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {node.buyPrice.toLocaleString()} RWF · 150 Days
          </p>
        </div>
      </div>

      <div className="flex justify-between items-end mb-3 text-sm">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Yield</p>
          <p className="font-bold text-slate-900">{currentYield.toLocaleString()} RWF</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Daily</p>
          <p className="font-bold text-emerald-600">+{node.dailyYield.toLocaleString()}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
          <span>PROGRESS</span>
          <span>{daysRunning} / 150 Days</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Card>
  );
}