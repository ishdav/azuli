"use client";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowDownLeft, Loader2 } from "lucide-react";
import Loader from "@/components/Loader";

export default function WithdrawPage() {
  const { user, isLoaded, withdraw } = useApp();
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) router.push("/");
  }, [user, isLoaded, router]);

  if (!isLoaded || !user) return null;

  const numericAmount = parseFloat(amount) || 0;
  const tax = numericAmount * 0.15;
  const finalAmount = numericAmount - tax;
  const canWithdraw = numericAmount >= 3000 && numericAmount <= user.balance;

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      await withdraw(numericAmount); // Assume withdraw is defined in context
      alert(`Withdrawal requested for ${finalAmount.toLocaleString()} RWF`);
      router.push("/profile");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen pb-32">
      <Header title="Withdraw Funds" showBack />
      <main className="p-4 space-y-4">
        
        <Card className="p-6 border-none shadow-sm bg-slate-900 text-white rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-30"></div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1">Available Balance</p>
          <h2 className="text-3xl font-bold">{user.balance.toLocaleString()} RWF</h2>
        </Card>

        <Card className="p-6 border-none shadow-sm bg-white rounded-3xl space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount (RWF)</label>
            <div className="flex items-center gap-2 mt-2 bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:border-indigo-500 transition-colors">
              <span className="text-xl font-bold text-slate-400">RWF</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent outline-none text-3xl font-bold text-slate-900 placeholder:text-slate-300"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Min withdrawal: 3,000 RWF</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tax (15%)</span>
              <span className="font-bold text-rose-500">-{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-slate-200 pt-2">
              <span className="font-bold text-slate-900">You Receive</span>
              <span className="font-bold text-emerald-600">{finalAmount.toLocaleString()} RWF</span>
            </div>
          </div>

          <Button 
  onClick={handleWithdraw}
  disabled={loading || !canWithdraw}
  className="w-full h-14 rounded-2xl text-base font-bold ..."
>
  {loading ? <Loader fullScreen={false} /> : "Confirm Withdrawal"}
</Button>
        </Card>
      </main>
    </div>
  );
}