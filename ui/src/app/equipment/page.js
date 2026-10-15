"use client";
import { useApp, EQUIPMENT_CATALOG } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function EquipmentPage() {
  const { user } = useApp();
  const router = useRouter();

  if (!user) return null;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mt-4 mb-6">
        <ArrowLeft size={20} className="cursor-pointer" onClick={() => router.back()} />
        <h1 className="text-xl font-bold">Acquire Equipment</h1>
      </div>

      <div className="space-y-3">
        {EQUIPMENT_CATALOG.map((eq) => (
          <Card 
            key={eq.id} 
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => router.push(`/equipment/${eq.id}`)}
          >
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img src={eq.image} alt={eq.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{eq.name}</h3>
                <p className="text-xs text-gray-500">150 Day Cycle</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">+{eq.dailyEarning} RWF/Day</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">{eq.price} RWF</p>
              <p className="text-[10px] text-gray-400 mt-1">View Details &gt;</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}