"use client";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, FileText } from "lucide-react";
import TransactionCard from "@/components/TransactionCard";

export default function HistoryPage() {
  const { user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/");
  }, [user, router]);

  if (!user) return null;

  // Filter only withdrawals
  const withdrawals = user.transactions.filter((t) => t.type === "Withdraw");

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mt-2">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={16} className="text-gray-700" />
        </button>
        <h1 className="text-base font-semibold">Withdrawal history</h1>
        <div className="w-9 h-9" /> {/* Spacer for centering */}
      </div>

      {/* Withdrawals List */}
      {withdrawals.length === 0 ? (
        <Card className="p-8 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
            <FileText size={20} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm font-medium">
            No withdrawal history yet
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Your withdrawals will appear here
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {withdrawals.map((tx) => (
            <TransactionCard
              key={tx.id}
              tx={tx}
              accountNumber={user.phone.replace(/^0/, "79")}
            />
          ))}
        </div>
      )}
    </div>
  );
}