"use client";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";
import TransactionCard from "@/components/TransactionCard";
import { Card } from "@/components/ui/card";

export default function HistoryPage() {
  const { user, isLoaded } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) router.push("/");
  }, [user, isLoaded, router]);

  if (!isLoaded || !user) return null;

// Inside HistoryPage
const withdrawals = user.transactions?.filter((t) => t.type === "Withdraw") || [];
  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen pb-32">
      <Header title="Transaction History" showBack />
      <main className="p-4 space-y-3">
        {withdrawals.length > 0 ? (
          withdrawals.map((tx) => <TransactionCard key={tx.id} tx={tx} />)
        ) : (
          <Card className="p-8 text-center border-none shadow-sm bg-white rounded-2xl text-slate-400 text-sm">
            No withdrawal history found.
          </Card>
        )}
      </main>
    </div>
  );
}