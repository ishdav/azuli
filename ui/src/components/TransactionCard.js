"use client";
import { Card } from "@/components/ui/card";
import {
  Download,
  ArrowDownLeft,
  Gift,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

const ICONS = {
  Withdraw: { Icon: Download, bg: "bg-red-500" },
  Deposit: { Icon: ArrowDownLeft, bg: "bg-emerald-500" },
  Referral: { Icon: Gift, bg: "bg-orange-500" },
  "Referral L2": { Icon: Gift, bg: "bg-amber-500" },
  Purchase: { Icon: ShoppingCart, bg: "bg-blue-500" },
  Bonus: { Icon: TrendingUp, bg: "bg-emerald-500" },
  "Check-in": { Icon: TrendingUp, bg: "bg-emerald-500" },
};

export default function TransactionCard({ tx, accountNumber }) {
  const config = ICONS[tx.type] || ICONS.Bonus;
  const { Icon, bg } = config;

  const isNegative = tx.amount < 0;
  const amountColor = isNegative ? "text-red-500" : "text-emerald-600";

  return (
    <Card className="p-4 flex justify-between items-start">
      {/* Left: Icon + Details */}
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center text-white flex-shrink-0`}
        >
          <Icon size={18} />
        </div>

        <div className="space-y-1">
          <h4 className="font-bold text-sm text-gray-900">{tx.type}</h4>
          <p className="text-[11px] text-gray-400">
            {new Date(tx.date).toLocaleString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }).replace(",", "")}
          </p>
          <p className="text-[11px] text-gray-400">
            Account {accountNumber}
          </p>
        </div>
      </div>

      {/* Right: Amount + Status */}
      <div className="flex flex-col items-end gap-2">
        <p className={`font-bold text-sm ${amountColor}`}>
          {isNegative ? "" : "+"}
          {tx.amount.toLocaleString()} RWF
        </p>
        <span
          className={`text-[10px] font-medium px-3 py-1 rounded-full ${
            tx.status === "Success" || tx.status === "successful"
              ? "bg-emerald-50 text-emerald-600"
              : tx.status === "Pending"
              ? "bg-orange-50 text-orange-600"
              : "bg-red-50 text-red-600"
          }`}
        >
          {tx.type === "Withdraw"
            ? `Withdrawal ${tx.status.toLowerCase()}`
            : tx.status}
        </span>
      </div>
    </Card>
  );
}