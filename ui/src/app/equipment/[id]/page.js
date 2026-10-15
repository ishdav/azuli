"use client";
import { useApp, EQUIPMENT_CATALOG } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Zap } from "lucide-react";
import { useState } from "react";

export default function EquipmentDetail() {
  const { id } = useParams();
  const { user, buyEquipment } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const equipment = EQUIPMENT_CATALOG.find(e => e.id === id);

  if (!user || !equipment) return <div className="p-6 text-center">Equipment not found</div>;

  const handleBuy = () => {
    setLoading(true);
    try {
      buyEquipment(equipment.id);
      alert(`Successfully acquired ${equipment.name}!`);
      router.push("/profile");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mt-4 mb-4">
        <ArrowLeft size={20} className="cursor-pointer" onClick={() => router.back()} />
        <h1 className="text-lg font-bold">Equipment Details</h1>
      </div>

      <div className="w-full h-48 bg-gray-200 rounded-xl overflow-hidden">
        <img src={equipment.image} alt={equipment.name} className="w-full h-full object-cover" />
      </div>

      <Card className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">{equipment.name}</h2>
            <p className="text-sm text-gray-500">150 Day Cycle</p>
          </div>
          <Zap className="text-emerald-500" size={24} />
        </div>

        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Daily earnings</span>
            <span className="font-bold text-emerald-600">+{equipment.dailyEarning} RWF/day</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Unit Price</span>
            <span className="font-bold">{equipment.price} RWF</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total earnings (Est.)</span>
            <span className="font-bold">{equipment.dailyEarning * 150} RWF</span>
          </div>
        </div>

        <Button 
          onClick={handleBuy} 
          disabled={loading || user.balance < equipment.price}
          className={`w-full py-6 text-lg font-bold ${user.balance < equipment.price ? 'bg-gray-300 text-gray-500' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
        >
          {loading ? "Processing..." : user.balance < equipment.price ? "Insufficient Balance" : "Acquire equipment"}
        </Button>
      </Card>
    </div>
  );
}