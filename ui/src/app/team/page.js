"use client";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Copy, CheckCircle2, Users, Gift, TrendingUp } from "lucide-react";
import AppMenu from "@/components/AppMenu";
import Logo from "../../../public/logo.png";

export default function TeamPage() {
  const { user, getDownlines } = useApp();
  const router = useRouter();
  const [downlines, setDownlines] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) router.push("/");
  }, [user, router]);

  useEffect(() => {
    if (user) {
      setDownlines(getDownlines());
    }
  }, [user, getDownlines]);

  const copyCode = useCallback(() => {
    if (!user) return;
    navigator.clipboard.writeText(user.invitationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [user]);

  if (!user) return null;

  return (
    <div className="p-4 space-y-5 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mt-2">
        <AppMenu />
        <h1 className="text-base font-semibold">My Team</h1>
        <div className="w-9 h-9 rounded-md overflow-hidden border border-gray-100">
          <img
            src={Logo.src}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Invitation Code Card */}
      <Card className="relative overflow-hidden p-0 border-none shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full -mr-12 -mt-12 blur-2xl"></div>

        <div className="relative p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Gift size={14} className="text-emerald-200" />
            <p className="text-[10px] uppercase tracking-widest text-emerald-200 font-bold">
              Your Invitation Code
            </p>
          </div>

          <div className="flex justify-between items-center mt-2">
            <h2 className="text-3xl font-bold tracking-widest">
              {user.invitationCode}
            </h2>
            <Button
              variant="secondary"
              size="icon"
              onClick={copyCode}
              className="bg-white/15 hover:bg-white/25 backdrop-blur text-white border-none rounded-md h-10 w-10"
            >
              {copied ? (
                <CheckCircle2 size={18} />
              ) : (
                <Copy size={18} />
              )}
            </Button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[10px] text-emerald-100 bg-white/10 backdrop-blur px-3 py-2 rounded-md">
            <TrendingUp size={12} />
            <span>
              Earn <strong>2,500 RWF</strong> per direct invite ·{" "}
              <strong>300 RWF</strong> per indirect invite
            </span>
          </div>
        </div>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="w-8 h-8 rounded-md bg-emerald-50 flex items-center justify-center mb-2">
            <Users size={14} className="text-emerald-600" />
          </div>
          <p className="text-xs text-gray-500 font-medium">Total Downlines</p>
          <h3 className="text-xl font-bold text-gray-900 mt-0.5">
            {downlines.length}
          </h3>
        </Card>
        <Card className="p-4">
          <div className="w-8 h-8 rounded-md bg-orange-50 flex items-center justify-center mb-2">
            <Gift size={14} className="text-orange-500" />
          </div>
          <p className="text-xs text-gray-500 font-medium">Referral Bonus</p>
          <h3 className="text-xl font-bold text-emerald-600 mt-0.5">
            {(
              downlines.filter((d) => d.invitedBy === user.id).length * 2500
            ).toLocaleString()}
          </h3>
        </Card>
      </div>

      {/* Downlines List */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800 text-sm">My Downlines</h3>
          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-bold">
            {downlines.length} Users
          </span>
        </div>

        {downlines.length === 0 ? (
          <Card className="p-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-md bg-emerald-50 flex items-center justify-center mb-3">
              <Users size={20} className="text-emerald-600" />
            </div>
            <p className="text-gray-500 text-sm font-medium">
              No referrals yet
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Share your code to start earning!
            </p>
            <Button
              onClick={copyCode}
              className="mt-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md h-9 px-5 text-xs font-bold"
            >
              {copied ? "Code Copied!" : "Copy Invitation Code"}
            </Button>
          </Card>
        ) : (
          <div className="space-y-2">
            {downlines.map((downline) => (
              <Card
                key={downline.id}
                className="p-3 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-bold text-xs">
                    {downline.phone.slice(-2)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">
                      {downline.phone}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Joined{" "}
                      {new Date(
                        downline.id.slice(0, 8)
                      ).toLocaleDateString() || "Recently"}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                  +2,500 RWF
                </span>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}