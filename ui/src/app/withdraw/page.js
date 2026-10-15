"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";

export default function WithdrawPage() {
  const { user, withdraw } = useApp();
  const [amount, setAmount] = useState("");
  const router = useRouter();

  const handleWithdraw = () => {
    const amt = parseFloat(amount);
    try {
      const final = withdraw(amt);
      alert(`Withdrawal successful! You will receive ${final.toFixed(2)} RWF after 15% tax.`);
      router.push("/");
    } catch (e) {
      alert(e.message);
    }
  };

  const tax = amount ? parseFloat(amount) * 0.15 : 0;
  const finalAmount = amount ? parseFloat(amount) - tax : 0;

  if (!user) return null;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mt-4 mb-6">
        <ArrowLeft size={20} className="cursor-pointer" onClick={() => router.back()} />
        <h1 className="text-xl font-bold">Withdraw</h1>
      </div>

      <Card className="p-6 text-center bg-emerald-50 border-none shadow-sm">
        <p className="text-xs text-gray-500 mb-1">AVAILABLE BALANCE</p>
        <div className="flex justify-center items-end gap-2">
          <h2 className="text-4xl font-bold text-gray-900">{user.balance.toFixed(2)}</h2>
          <span className="text-gray-500 text-sm mb-1">RWF</span>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border">
          <Button variant="ghost" size="icon" onClick={() => setAmount(Math.max(0, parseFloat(amount || 0) - 1000).toString())}>-</Button>
          <div className="text-center flex-1">
            <p className="text-xs text-gray-500">RWF</p>
            <input 
              type="number" 
              className="text-2xl font-bold text-center w-full bg-transparent outline-none" 
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-xs text-gray-400">Withdrawal amount</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setAmount((parseFloat(amount || 0) + 1000).toString())}>+</Button>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Withdrawals as percentage</span>
          <span>100%</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="border-emerald-200 text-emerald-700" onClick={() => setAmount(user.balance.toString())}>MAX</Button>
          <div className="text-right text-xs text-gray-500">Min. withdrawal: 3000 RWF</div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Final amount</span>
            <span className="font-bold text-emerald-600">{finalAmount.toFixed(2)} RWF</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Tax Rate</span>
            <span>15%</span>
          </div>
        </div>

        <Button onClick={handleWithdraw} className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-6">
          <Download className="mr-2" size={18} /> EXTRACT CREDITS
        </Button>
      </Card>
    </div>
  );
}