"use client";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        onClick={() => router.push("/equipment")}
        className="h-14 bg-emerald-800 hover:bg-emerald-900 text-white"
      >
        <ShoppingCart className="mr-2" size={18} /> Acquire equipment
      </Button>
      <Button
        onClick={() => router.push("/recharge")}
        variant="outline"
        className="h-14 border-emerald-200 text-emerald-800 hover:bg-emerald-50"
      >
        <Wallet className="mr-2" size={18} /> Recharge
      </Button>
    </div>
  );
}