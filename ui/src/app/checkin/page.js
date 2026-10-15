"use client";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";

export default function CheckInPage() {
  const { user, checkIn } = useApp();
  const router = useRouter();
  const tomorrow = "Tomorrow's Reward"

  const handleCheckIn = () => {
    try {
      checkIn();
      alert("Check-in successful! 200 RWF added to your balance.");
    } catch (e) {
      alert(e.message);
    }
  };

  const today = new Date().toDateString();
  const hasCheckedIn = user?.lastCheckin && new Date(user.lastCheckin).toDateString() === today;

  if (!user) return null;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mt-4 mb-6">
        <ArrowLeft size={20} className="cursor-pointer" onClick={() => router.back()} />
        <h1 className="text-xl font-bold">Check-in</h1>
      </div>

      <Card className="p-6 bg-emerald-800 text-white relative overflow-hidden border-none">
        <div className="relative z-10">
          <p className="text-emerald-200 text-sm mb-1">{tomorrow}</p>
          <div className="flex items-end gap-2">
            <h2 className="text-5xl font-bold">200</h2>
            <span className="text-emerald-200 text-lg mb-1">RWF</span>
          </div>
          <p className="text-emerald-200 text-sm mt-4">7 Days</p>
        </div>
        <div className="absolute right-[-20px] top-[-20px] w-32 h-32 border-4 border-emerald-600 rounded-full opacity-50"></div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 text-center">
          <h3 className="text-2xl font-bold">{user.consecutiveDays || 0}</h3>
          <p className="text-xs text-gray-500">Consecutive Days</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-2xl font-bold">{user.totalEarnings.toFixed(2)}</h3>
          <p className="text-xs text-gray-500">Total Earnings</p>
        </Card>
      </div>

      <Button 
        onClick={handleCheckIn} 
        disabled={hasCheckedIn}
        className={`w-full py-6 text-lg font-bold ${hasCheckedIn ? 'bg-gray-200 text-gray-500' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
      >
        {hasCheckedIn ? "ALREADY CHECKED IN TODAY" : "NODE SYNCED - CHECK IN NOW"}
      </Button>

      <Card className="p-4 space-y-4">
        <h3 className="font-bold flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-600"/> Rule</h3>
        <ul className="text-sm text-gray-600 space-y-3">
          <li className="flex gap-2"><span>1.</span> Shadeform System Notice</li>
          <li className="flex gap-2"><span>2.</span> Automatic System Updates</li>
          <li className="text-xs text-gray-500 pl-6">Daily activity rewards will be automatically updated at 00:00 daily.</li>
          <li className="flex gap-2"><span>3.</span> Daily System Check-in</li>
          <li className="text-xs text-gray-500 pl-6">Each user can check in once a day and receive 200 RWF.</li>
        </ul>
      </Card>
    </div>
  );
}