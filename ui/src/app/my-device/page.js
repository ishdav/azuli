"use client";
import { useApp, EQUIPMENT_CATALOG } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Cpu } from "lucide-react";
import { useEffect } from "react";
import StatCard from "@/components/StatCard";
import DeviceCard from "@/components/DeviceCard";

export default function MyDevicePage() {
  const { user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/");
  }, [user, router]);

  if (!user) return null;

  // Compute statistics
  const totalStaked = user.equipment.reduce(
    (sum, eq) => sum + eq.buyPrice,
    0
  );
  const deviceCount = user.equipment.length;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mt-4 mb-2">
        <ArrowLeft
          size={20}
          className="cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-xl font-bold">My Device</h1>
      </div>

      {/* Stats Section — 3 cards stacked */}
      <div className="space-y-3">
        <StatCard
          label="Cumulative income"
          value={user.totalEarnings.toLocaleString()}
          suffix="RWF"
        />
        <StatCard
          label="Device running"
          value={deviceCount}
        />
        <StatCard
          label="TOTAL STAKED"
          value={totalStaked.toLocaleString()}
          suffix="RWF"
          valueClassName="text-orange-500"
        />
      </div>

      {/* My Device Section */}
      <div className="pt-2">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800">My device</h3>
          {deviceCount > 0 && (
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {deviceCount} Device running
            </span>
          )}
        </div>

        {deviceCount === 0 ? (
          <Card className="p-8 text-center flex flex-col items-center">
            <Cpu size={40} className="text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No active devices yet.</p>
            <Button
              onClick={() => router.push("/equipment")}
              className="mt-4 bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              Acquire Equipment
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {user.equipment.map((eq) => {
              const catalogItem = EQUIPMENT_CATALOG.find(
                (c) => c.id === eq.equipmentId
              );
              return (
                <DeviceCard
                  key={eq.id}
                  device={eq}
                  catalogItem={catalogItem}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}