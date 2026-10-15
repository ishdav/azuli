"use client";
import { Card } from "@/components/ui/card";

export default function BalanceCard({ balance, label = "ACCOUNT BALANCE" }) {
  return (
    <Card className="p-6 bg-gradient-to-br from-emerald-50 to-white rounded-md shadow-lg border-emerald-100">
      <p className="text-sm text-gray-500 font-bold">{label}</p>
      <div className="flex items-end gap-3 mt-1">
        <h2 className="text-4xl font-bold text-gray-900">
          {Number(balance).toFixed(2)}
        </h2>
        <span className="text-emerald-600 text-sm font-medium mb-1">RWF</span>
      </div>
    </Card>
  );
}