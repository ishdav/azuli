"use client";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const MIN_WITHDRAWAL = 3000;
const TAX_RATE = 0.15;

export default function WithdrawPage() {
  const { user, withdraw } = useApp();
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("mtn");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) router.push("/");
  }, [user, router]);

  if (!user) return null;

  // Calculations
  const numericAmount = parseFloat(amount) || 0;
  const tax = numericAmount * TAX_RATE;
  const finalAmount = numericAmount - tax;
  const percentage =
    user.balance > 0
      ? Math.min(Math.round((numericAmount / user.balance) * 100), 100)
      : 0;

  // Validation flags
  const isBelowMin = numericAmount > 0 && numericAmount < MIN_WITHDRAWAL;
  const isOverBalance = numericAmount > user.balance;
  const canWithdraw =
    numericAmount >= MIN_WITHDRAWAL && !isOverBalance && user.balance > 0;

  const handleIncrement = () => {
    setAmount((prev) =>
      Math.min((parseFloat(prev) || 0) + 1000, user.balance).toString()
    );
  };

  const handleDecrement = () => {
    setAmount((prev) =>
      Math.max((parseFloat(prev) || 0) - 1000, 0).toString()
    );
  };

  const handleMax = () => {
    setAmount(user.balance.toString());
  };

  const handleWithdraw = () => {
    if (!canWithdraw) return;
    setLoading(true);
    try {
      const final = withdraw(numericAmount);
      alert(
        `Withdrawal successful!\n\nYou will receive ${final.toFixed(
          2
        )} RWF via ${selectedNetwork.toUpperCase()} after 15% tax.`
      );
      router.push("/history");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mt-4 mb-2">
        <ArrowLeft
          size={20}
          className="cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-xl font-bold">Withdraw</h1>
      </div>

      {/* Available Balance Banner */}
      <Card className="p-6 bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
        <div className="flex justify-center mb-3">
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-md tracking-widest">
            CREDIT EXTRACTION
          </span>
        </div>
        <p className="text-xs text-center text-gray-500 font-medium mb-1">
          AVAILABLE BALANCE
        </p>
        <div className="flex items-end justify-center gap-2">
          <h2 className="text-4xl font-bold text-gray-900">
            {user.balance.toLocaleString()}
          </h2>
          <span className="text-gray-500 text-sm font-medium mb-1">RWF</span>
        </div>
      </Card>

      {/* Step 1: Output Node */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
            01
          </span>
          <h3 className="font-bold text-sm">OUTPUT NODE</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* MTN Card */}
          <div
            onClick={() => setSelectedNetwork("mtn")}
            className={`relative cursor-pointer rounded-md border-2 p-3 transition-all ${
              selectedNetwork === "mtn"
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            {selectedNetwork === "mtn" && (
              <CheckCircle2
                size={16}
                className="absolute top-2 right-2 text-emerald-600 fill-emerald-100"
              />
            )}
            <p className="text-[10px] text-gray-500 font-medium">
              OUTPUT NODE
            </p>
            <p className="font-bold text-sm mt-1">mtn</p>
            <p className="text-xs text-gray-500 mt-0.5">079****456</p>
            {selectedNetwork === "mtn" && (
              <div className="h-0.5 bg-emerald-500 rounded-md mt-2" />
            )}
          </div>

          {/* Airtel Card */}
          <div
            onClick={() => setSelectedNetwork("airtel")}
            className={`relative cursor-pointer rounded-md border-2 p-3 transition-all ${
              selectedNetwork === "airtel"
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            {selectedNetwork === "airtel" && (
              <CheckCircle2
                size={16}
                className="absolute top-2 right-2 text-emerald-600 fill-emerald-100"
              />
            )}
            <p className="text-[10px] text-gray-500 font-medium">
              OUTPUT NODE
            </p>
            <p className="font-bold text-sm mt-1">airtel</p>
            <p className="text-xs text-gray-500 mt-0.5">073****123</p>
            {selectedNetwork === "airtel" && (
              <div className="h-0.5 bg-emerald-500 rounded-md mt-2" />
            )}
          </div>
        </div>
      </Card>

      {/* Step 2: Extract Credits */}
      <Card className="p-5 space-y-5">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
            02
          </span>
          <h3 className="font-bold text-sm">EXTRACT CREDITS</h3>
        </div>

        {/* Amount Input */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDecrement}
            className="h-14 w-14 rounded-md border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          >
            <Minus size={18} />
          </Button>

          <div className="flex-1 text-center bg-gray-50 rounded-md border border-gray-200 py-2">
            <p className="text-[10px] font-bold text-emerald-600 mb-0.5">RWF</p>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-2xl font-bold text-center w-full bg-transparent outline-none placeholder:text-gray-400"
            />
            <p className="text-[10px] text-gray-400">Withdrawal amount</p>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleIncrement}
            className="h-14 w-14 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white border-none"
          >
            <Plus size={18} />
          </Button>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-600 font-medium">
              Withdrawals as percentage
            </span>
            <span className="text-gray-700 font-bold">{percentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-md overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-orange-500 rounded-md transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* MAX Button */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleMax}
            className="rounded-md border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          >
            MAX
            <span className="ml-2 text-xs text-gray-500">
              {user.balance.toLocaleString()}
            </span>
          </Button>
          <div className="flex items-center justify-end text-[10px] text-gray-500">
            Min: {MIN_WITHDRAWAL.toLocaleString()} RWF
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-4 rounded-md space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Final amount</span>
            <span className="font-bold text-emerald-600">
              {finalAmount.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}{" "}
              RWF
            </span>
          </div>
          <div className="flex justify-between text-xs pt-2 border-t border-gray-200">
            <span className="text-gray-500">Tax Rate</span>
            <span className="font-medium text-gray-700">
              {(TAX_RATE * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Min. withdrawal</span>
            <span className="font-medium text-gray-700">
              {MIN_WITHDRAWAL.toLocaleString()} RWF
            </span>
          </div>
        </div>

        {/* Validation Messages */}
        {isBelowMin && (
          <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-3 rounded-md">
            <AlertCircle size={14} />
            Minimum withdrawal is {MIN_WITHDRAWAL.toLocaleString()} RWF
          </div>
        )}
        {isOverBalance && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle size={14} />
            Insufficient balance
          </div>
        )}

        {/* Extract Button */}
        <Button
          onClick={handleWithdraw}
          disabled={loading || !canWithdraw}
          className={`w-full py-6 text-base font-bold rounded-md ${
            canWithdraw
              ? "bg-emerald-700 hover:bg-emerald-800 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Download className="mr-2" size={18} />
          {loading ? "Processing..." : "EXTRACT CREDITS"}
        </Button>
      </Card>

      {/* Notice Section */}
      <Card className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-orange-400">💡</span>
          <h4 className="font-bold text-sm">Notice</h4>
        </div>
        <div className="text-xs text-gray-600 space-y-2">
          <div className="flex items-start gap-2">
            <span className="font-bold text-gray-500">1.</span>
            <span>
              <strong>Withdrawal Policy</strong> — All withdrawals are processed
              within 2–10 minutes.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-gray-500">2.</span>
            <span>
              <strong>Minimum Withdrawal Amount</strong> — You must have at
              least {MIN_WITHDRAWAL.toLocaleString()} RWF in your account to
              withdraw.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-gray-500">3.</span>
            <span>
              A 15% tax is applied to every withdrawal as required by
              regulations.
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}