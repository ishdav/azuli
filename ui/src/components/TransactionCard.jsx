"use client";
import { Card } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, ShoppingCart, Gift, CheckCircle2 } from "lucide-react";

const ICON_MAP = {
  Deposit: { icon: ArrowDownLeft, color: "bg-emerald-50 text-emerald-600" },
  Withdraw: { icon: ArrowUpRight, color: "bg-rose-50 text-rose-600" },
  Purchase: { icon: ShoppingCart, color: "bg-indigo-50 text-indigo-600" },
  Referral: { icon: Gift, color: "bg-amber-50 text-amber-600" },
};

export default function TransactionCard({ tx }) {
  const config = ICON_MAP[tx.type] || ICON_MAP.Deposit;
  const Icon = config.icon;
  const isNegative = tx.amount < 0;

  return (
    <Card className="p-4 border-none shadow-sm bg-white rounded-2xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.color}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="font-bold text-sm text-slate-900">{tx.type}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {new Date(tx.date).toLocaleString("en-GB", {
              day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
            })}
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <p className={`font-bold text-sm ${isNegative ? "text-slate-900" : "text-emerald-600"}`}>
          {isNegative ? "" : "+"}{tx.amount.toLocaleString()} RWF
        </p>
        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-emerald-600 font-medium">
          <CheckCircle2 size={10} /> {tx.status}
        </div>
      </div>
    </Card>
  );
}