"use client";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, CheckCircle2 } from "lucide-react";

export default function HistoryPage() {
  const { user } = useApp();
  const router = useRouter();

  if (!user) return null;

  // Filter only withdrawals
  const withdrawals = user.transactions.filter(t => t.type === 'Withdraw');

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mt-4 mb-6">
        <ArrowLeft size={20} className="cursor-pointer" onClick={() => router.back()} />
        <h1 className="text-xl font-bold">Withdrawal history</h1>
      </div>

      {withdrawals.length === 0 ? (
        <Card className="p-8 text-center text-gray-500 text-sm">
          No withdrawal history found.
        </Card>
      ) : (
        <div className="space-y-3">
          {withdrawals.map((tx) => (
            <Card key={tx.id} className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                  <Download size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Withdraw</h4>
                  <p className="text-[10px] text-gray-500">{new Date(tx.date).toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400 mt-1">Account: {user.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-red-600">{tx.amount} RWF</p>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1 mt-1">
                  <CheckCircle2 size={10} /> {tx.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}