"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, CheckCircle2 } from "lucide-react";

export default function RechargePage() {
  const { user, recharge } = useApp();
  const [amount, setAmount] = useState(10000);
  const [step, setStep] = useState(1); // 1: Select Amount, 2: Payment Instructions
  const router = useRouter();

  const handleFund = () => {
    if (amount < 10000) return alert("Minimum deposit is 10,000 RWF");
    setStep(2);
  };

  const confirmPayment = () => {
    try {
      recharge(amount);
      alert("Deposit successful!");
      router.push("/");
    } catch (e) {
      alert(e.message);
    }
  };

  if (!user) return null;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mt-4 mb-6">
        <ArrowLeft size={20} className="cursor-pointer" onClick={() => router.back()} />
        <h1 className="text-xl font-bold">Recharge</h1>
      </div>

      {step === 1 && (
        <>
          <Card className="p-6 text-center border-emerald-100 bg-emerald-50/50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">CREDIT TOP-UP</span>
              <span className="text-2xl">⚡</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">FUND YOUR NODE</h2>
            <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><CheckCircle2 size={12}/> ENCRYPTED</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12}/> INSTANT CREDIT</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12}/> SECURE PAYMENT</span>
            </div>
          </Card>

          <Card className="p-6 space-y-6">
            <h3 className="text-center font-bold">Select Amount</h3>
            <div className="flex items-center justify-between bg-gray-50 border rounded-lg p-2">
              <Button variant="ghost" size="icon" onClick={() => setAmount(Math.max(0, amount - 5000))}>-</Button>
              <div className="text-center">
                <p className="text-xs text-emerald-600 font-bold">RWF</p>
                <input 
                  type="number" 
                  className="text-3xl font-bold text-center w-32 bg-transparent outline-none" 
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                />
                <p className="text-[10px] text-gray-400">INSTANT CREDIT</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setAmount(amount + 5000)}>+</Button>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span className="text-emerald-600 border-b-2 border-emerald-600 pb-1">10000</span>
              <span>30000</span>
              <span>90000</span>
              <span>270000</span>
            </div>

            <Button onClick={handleFund} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-6 text-lg">
              <span className="mr-2">▶</span> FUND ACCOUNT
            </Button>

            <div className="text-xs text-gray-500 space-y-2 mt-4 border-t pt-4">
              <p className="font-bold text-gray-700">Notice</p>
              <p>📌 Shadeform Deposit Guide</p>
              <p>1. Minimum Deposit Amount</p>
              <p className="pl-4">The minimum deposit amount allowed is 10,000.</p>
              <p>2. Payment Information Verification</p>
              <p className="pl-4">Before making any transfer, please carefully verify the payment details assigned by the system.</p>
            </div>
          </Card>
        </>
      )}

      {step === 2 && (
        <Card className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-emerald-600 mb-2">RWF {amount}</h2>
            <p className="text-sm text-gray-500">Please select payment wallet</p>
          </div>

          <div className="flex gap-2 border rounded-lg p-2">
            <button className="flex-1 bg-yellow-400 text-black font-bold py-2 rounded flex justify-center items-center gap-1"><span className="text-[10px]">MTN</span></button>
            <button className="flex-1 bg-white text-red-500 border font-bold py-2 rounded flex justify-center items-center gap-1"><span className="text-[10px]">airtel</span></button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-4">
            <div>
              <p className="font-bold text-gray-800">Step 1</p>
              <p className="text-gray-600">Copy the wallet account:</p>
              <div className="flex justify-between items-center bg-white p-2 rounded border mt-1">
                <span className="font-bold text-emerald-600">MTN 0796714456</span>
                <Button size="sm" className="bg-emerald-600 h-6 text-[10px]" onClick={() => navigator.clipboard.writeText("0796714456")}>Copy</Button>
              </div>
            </div>
            <div>
              <p className="font-bold text-gray-800">Step 2</p>
              <p className="text-gray-600">Transfer to the wallet account above</p>
              <p className="text-xs text-emerald-600 font-mono mt-1">*182*1*1*0796714456*{amount}#</p>
            </div>
            <div>
              <p className="font-bold text-gray-800">Step 3</p>
              <p className="text-gray-600">Please enter your entire payment SMS</p>
              <textarea className="w-full border rounded p-2 mt-1 text-xs" rows={3} placeholder="Paste SMS here..."></textarea>
            </div>
          </div>

          <Button onClick={confirmPayment} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-6">
            Submit
          </Button>
          <p className="text-[10px] text-center text-gray-500">Payment processing takes 2-10 minutes. If not processed, please check your payment SMS.</p>
        </Card>
      )}
    </div>
  );
}