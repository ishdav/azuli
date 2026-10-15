"use client";
import { useApp, EQUIPMENT_CATALOG } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";
import AppMenu from "@/components/AppMenu";
import BalanceCard from "@/components/BalanceCard";
import QuickActions from "@/components/QuickActions";
import EquipmentList from "@/components/EquipmentList";

export default function HomePage() {
  const { user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="p-4 space-y-6">
      <Header title="Home" leftSlot={<AppMenu />} />

      <BalanceCard balance={user.balance} />

      <QuickActions />

      <EquipmentList
        title="Popular AI computing equipment"
        items={EQUIPMENT_CATALOG.slice(0, 7)}
        seeAllLink="/equipment"
      />
    </div>
  );
}