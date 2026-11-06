"use client";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, CheckCircle2, Loader2 } from "lucide-react";

export default function RechargePage() {
  const { user, recharge, isLoaded } = useApp();
  const [amount, setAmount] = useState(10000);
  const [step, setStep] = useState(1); 
  const [smsText, setSmsText] = useState(""); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) router.push("/");
  }, [user, isLoaded, router]);

  if (!isLoaded || !user) return null;

  const handleFund = () => {
    if (amount < 10000) return; // Safety check
    setStep(2);
  };

  const confirmPayment = async () => {
    if (!smsText.trim()) {
      return alert("Please paste the payment SMS or enter the Transaction ID.");
    }
    
    setLoading(true);
    try {
      await recharge(amount, smsText);
      alert("Deposit request submitted! Admin will verify and approve it shortly.");
      router.push("/home");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in bg-slate-50 min-h-screen">
      <div className="flex items-center gap-3 mt-4 mb-6">
        <ArrowLeft size={20} className="cursor-pointer text-slate-700" onClick={() => router.back()} />
        <h1 className="text-xl font-bold text-slate-900">Recharge</h1>
      </div>

      {step === 1 && (
        <>
          <Card className="p-6 text-center border-slate-200 shadow-sm rounded-3xl bg-white">
            <h2 className="text-xl font-bold text-slate-900">FUND YOUR NODE</h2>
            <div className="flex justify-center gap-4 mt-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><CheckCircle2 size={12}/> ENCRYPTED</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12}/> INSTANT CREDIT</span>
            </div>
          </Card>

          <Card className="p-6 space-y-6 border-none shadow-sm bg-white rounded-3xl">
            <h3 className="text-center font-bold text-slate-900">Select Amount</h3>
            
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setAmount(Math.max(10000, amount - 5000))} 
                className="rounded-xl"
              >
                -
              </Button>
              
              <div className="text-center">
                <p className="text-xs text-indigo-600 font-bold">RWF</p>
                <input 
                  type="number" 
                  min="10000"
                  className={`text-3xl font-bold text-center w-32 bg-transparent outline-none ${amount < 10000 ? 'text-rose-500' : 'text-slate-900'}`}
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setAmount(amount + 5000)} 
                className="rounded-xl"
              >
                +
              </Button>
            </div>

            {/* ✅ Show error message if amount is too low */}
            {amount < 10000 && (
              <p className="text-center text-xs font-bold text-rose-500">
                Minimum deposit is 10,000 RWF
              </p>
            )}

            {/* ✅ Disable button if amount < 10000 */}
            <Button 
              onClick={handleFund} 
              disabled={amount < 10000}
              className={`w-full py-6 rounded-xl font-bold text-base transition-all ${
                amount < 10000 
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30"
              }`}
            >
              FUND ACCOUNT
            </Button>
          </Card>
        </>
      )}

      {step === 2 && (
        <Card className="p-6 space-y-6 border-none shadow-sm bg-white rounded-3xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-indigo-600 mb-2">RWF {amount.toLocaleString()}</h2>
            <p className="text-sm text-slate-500">Please select payment wallet</p>
          </div>

          <div className="flex gap-2 border border-slate-200 rounded-xl p-2">
            <button className="flex-1 bg-yellow-400 text-black font-bold py-2 rounded-lg flex justify-center items-center gap-1"><span className="text-[10px]">MTN</span></button>
            <button className="flex-1 bg-white text-red-500 border border-slate-200 font-bold py-2 rounded-lg flex justify-center items-center gap-1"><span className="text-[10px]">Airtel</span></button>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl text-sm space-y-4">
            <div>
              <p className="font-bold text-slate-800">Step 1</p>
              <p className="text-slate-600">Copy the wallet account:</p>
              <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200 mt-1">
                <span className="font-bold text-indigo-600">MTN 0796714456</span>
                <Button size="sm" className="bg-indigo-600 h-6 text-[10px] rounded-md" onClick={() => navigator.clipboard.writeText("0796714456")}>Copy</Button>
              </div>
            </div>
            <div>
              <p className="font-bold text-slate-800">Step 2</p>
              <p className="text-slate-600">Transfer to the wallet account above</p>
              <p className="text-xs text-indigo-600 font-mono mt-1">*182*1*1*0796714456*{amount}#</p>
            </div>
            <div>
              <p className="font-bold text-slate-800">Step 3</p>
              <p className="text-slate-600">Paste the payment SMS below</p>
              
              <textarea 
                value={smsText}
                onChange={(e) => setSmsText(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 mt-2 text-xs outline-none focus:border-indigo-500 bg-white" 
                rows={3} 
                placeholder="Paste the entire payment SMS here, OR just write the Transaction ID (TxnID)."
                required
              ></textarea>
              <p className="text-[10px] text-amber-600 mt-1">This is required so the Admin can verify your payment.</p>
            </div>
          </div>

          <Button 
            onClick={confirmPayment} 
            disabled={loading || !smsText.trim()}
            className={`w-full py-6 rounded-xl font-bold text-base transition-all ${
              smsText.trim() ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30" : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Submit for Approval"}
          </Button>
        </Card>
      )}
    </div>
  );
}