"use client";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function WithdrawPage() {
  const { user, isLoaded, withdraw } = useApp();
  const router = useRouter();
  
  const [amount, setAmount] = useState("");
  const [withdrawPhone, setWithdrawPhone] = useState("");
  const [network, setNetwork] = useState("MTN");
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) router.push("/");
    if (user && !withdrawPhone) setWithdrawPhone(user.phone); 
  }, [user, isLoaded, router, withdrawPhone]);

  if (!isLoaded || !user) return null;

  const numericAmount = parseFloat(amount) || 0;
  const tax = numericAmount * 0.20;
  const finalAmount = numericAmount - tax;
  const canWithdraw = numericAmount >= 3000 && numericAmount <= user.balance && withdrawPhone && withdrawPassword;

  const handleWithdraw = async () => {
    if (!canWithdraw) return;
    setLoading(true);
    try {
      await withdraw(numericAmount, withdrawPhone, network, withdrawPassword);
      alert("Withdrawal requested successfully! Awaiting admin approval.");
      router.push("/history");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen pb-32">
      <div className="hidden md:block">
        <Header title="Withdraw Funds" showBack />
      </div>
      
      <main className="p-4 space-y-4">
        <Card className="p-6 border-none shadow-sm bg-slate-900 text-white rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-30"></div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1">Available Balance</p>
          <h2 className="text-3xl font-bold">{user.balance.toLocaleString()} RWF</h2>
        </Card>

        {/* ✅ Wrapped in a form with autocomplete off */}
        <form autoComplete="off" className="space-y-6">
          <Card className="p-6 border-none shadow-sm bg-white rounded-3xl space-y-6">
            
            {/* Amount Input */}
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

            {/* Mobile Money Details */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Mobile Money Number</label>
                <input
                  type="tel"
                  value={withdrawPhone}
                  onChange={(e) => setWithdrawPhone(e.target.value)}
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-sm font-medium"
                  placeholder="e.g., 0788..."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Network</label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-sm font-medium"
                >
                  <option value="MTN">MTN Mobile Money</option>
                  <option value="MPS">Airtel Money</option>
                </select>
              </div>
            </div>

            {/* Security: Withdraw Password */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">
                {user.hasWithdrawPassword ? "Enter Withdraw Password" : "Create Withdraw Password"}
              </label>
              <input
                type="password"
                // ✅ ADDED: Unique name and autocomplete="new-password" to stop browser autofill
                name="withdraw_security_pin"
                autoComplete="new-password"
                value={withdrawPassword}
                onChange={(e) => setWithdrawPassword(e.target.value)}
                placeholder={user.hasWithdrawPassword ? "••••••••" : "Set a new password"}
                className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-sm"
              />
              {!user.hasWithdrawPassword && (
                <p className="text-[10px] text-amber-600 mt-1">⚠️ This is NOT your login password. Keep it safe.</p>
              )}
              {user.hasWithdrawPassword && (
                <p 
                  className="text-[10px] text-indigo-600 mt-1 font-bold cursor-pointer hover:underline"
                  onClick={() => router.push("/forgot-withdraw-password")}
                >
                  Forgot Withdraw Password?
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax (20%)</span>
                <span className="font-bold text-rose-500">-{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-200 pt-2">
                <span className="font-bold text-slate-900">You Receive</span>
                <span className="font-bold text-emerald-600">{finalAmount.toLocaleString()} RWF</span>
              </div>
            </div>

            <Button 
              type="button" // ✅ Prevents form submission on click
              onClick={handleWithdraw}
              disabled={loading || !canWithdraw}
              className={`w-full h-14 rounded-2xl text-base font-bold ${
                canWithdraw ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30" : "bg-slate-200 text-slate-400"
              }`}
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : "Confirm Withdrawal"}
            </Button>
          </Card>
        </form>
      </main>
    </div>
  );
}