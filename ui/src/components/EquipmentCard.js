"use client";
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EquipmentCard({ equipment }) {
  const router = useRouter();

  return (
    <Card
      className="p-3 flex flex-col gap-3 rounded-md cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
      onClick={() => router.push(`/equipment/${equipment.id}`)}
    >
      <div className="w-full h-40 bg-gray-200 rounded-md overflow-hidden">
        <img
          src={equipment.image}
          alt={equipment.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm">{equipment.name}</h4>
          <Zap className="text-emerald-500" size={16} />
        </div>
        <p className="text-xs text-gray-500">150 Day Cycle</p>

        <hr className="border-gray-100" />

        <div className="flex justify-between items-center text-xs">
          <div>
            <p className="text-gray-500">Unit Price</p>
            <p className="font-bold text-sm">{equipment.price} RWF</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">Daily Earnings</p>
            <p className="font-bold text-sm text-emerald-600">
              +{equipment.dailyEarning} RWF
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}