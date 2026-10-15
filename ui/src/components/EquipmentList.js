"use client";
import EquipmentCard from "./EquipmentCard";
import { useRouter } from "next/navigation";

export default function EquipmentList({
  title = "Popular AI computing equipment",
  items = [],
  showSeeAll = true,
  seeAllLink = "/equipment",
  layout = "vertical", // "vertical" or "grid"
}) {
  const router = useRouter();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800">{title}</h3>
        {showSeeAll && (
          <span
            className="text-emerald-600 text-sm font-medium cursor-pointer"
            onClick={() => router.push(seeAllLink)}
          >
            See All
          </span>
        )}
      </div>

      <div
        className={
          layout === "grid"
            ? "grid grid-cols-1 gap-3"
            : "space-y-3"
        }
      >
        {items.map((eq) => (
          <EquipmentCard key={eq.id} equipment={eq} />
        ))}
      </div>
    </div>
  );
}