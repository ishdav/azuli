"use client";
import { Card } from "@/components/ui/card";

export default function StatCard({
  label,
  value,
  suffix,
  valueClassName = "text-gray-900",
  accent = false,
  prefix,
}) {
  return (
    <Card className="p-5">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <div className="flex items-end gap-2 mt-1">
        {prefix && (
          <span className="text-sm font-medium text-gray-500 mb-1">
            {prefix}
          </span>
        )}
        <h3
          className={`text-2xl font-bold ${valueClassName} ${
            accent ? "text-orange-500" : ""
          }`}
        >
          {value}
        </h3>
        {suffix && (
          <span className="text-xs font-medium text-gray-500 mb-1">
            {suffix}
          </span>
        )}
      </div>
    </Card>
  );
}