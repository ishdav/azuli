"use client";
import { useApp, EQUIPMENT_CATALOG } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppMenu from "@/components/AppMenu";
import EquipmentList from "@/components/EquipmentList";
import Logo from "../../../public/logo.png";

export default function EquipmentPage() {
  const { user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/");
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="p-4 space-y-5 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mt-2">
        <AppMenu />
        <h1 className="text-base font-semibold">Equipments</h1>
        <div className="w-9 h-9 rounded-md overflow-hidden border border-gray-100">
          <img
            src={Logo.src}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Equipment List */}
      <EquipmentList
        title="All Equipment"
        items={EQUIPMENT_CATALOG}
        showSeeAll={false}
        layout="grid"
      />
    </div>
  );
}