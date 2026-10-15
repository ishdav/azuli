"use client";
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";

export default function DeviceCard({ device, catalogItem }) {
  const daysRunning = Math.max(
    1,
    Math.floor(
      (Date.now() - new Date(device.purchaseDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const currentEarnings = daysRunning * device.dailyEarning;
  const roi = ((currentEarnings / device.buyPrice) * 100).toFixed(0);
  const progress = Math.min((daysRunning / 150) * 100, 100);

  return (
    <Card className="overflow-hidden p-0">
      {/* Device Image */}
      <div className="h-40 bg-gray-100 w-full">
        <img
          src={catalogItem?.image || "/images/placeholder.jpg"}
          alt={device.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Device Details */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-base">{device.name}</h4>
          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-bold flex items-center gap-1">
            ROI {roi}%
          </span>
        </div>

        <p className="text-xs text-gray-500">
          {device.buyPrice.toLocaleString()} RWF · 150 Day
        </p>

        <div className="space-y-2 pt-2 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Daily earnings</span>
            <span className="font-bold text-emerald-600">
              +{device.dailyEarning.toLocaleString()} RWF/day
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total earnings</span>
            <span className="font-bold text-gray-900">
              {currentEarnings.toLocaleString()} RWF
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-2">
          <div className="flex justify-between text-[10px] font-medium text-gray-500 mb-1">
            <span>COMPUTE CYCLE</span>
            <span>
              {daysRunning} / 150 Day
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-md overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-md transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}