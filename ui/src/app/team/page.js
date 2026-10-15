"use client";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, Users, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function TeamPage() {
  const { user, getDownlines } = useApp();
  const router = useRouter();
  const [downlines, setDownlines] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      setDownlines(getDownlines());
    }
  }, [user, getDownlines]);

  const copyCode = () => {
    navigator.clipboard.writeText(user.invitationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3 mt-4 mb-2">
        <ArrowLeft size={20} className="cursor-pointer" onClick={() => router.back()} />
        <h1 className="text-xl font-bold">My Team</h1>
      </div>

      {/* Invitation Code Card */}
      <Card className="p-6 bg-gradient-to-br from-emerald-800 to-emerald-600 text-white border-none">
        <p className="text-emerald-100 text-sm mb-1">Your Invitation Code</p>
        <div className="flex justify-between items-center mt-2">
          <h2 className="text-3xl font-bold tracking-widest">{user.invitationCode}</h2>
          <Button variant="secondary" size="icon" onClick={copyCode} className="bg-white/20 hover:bg-white/30 text-white border-none">
            {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
          </Button>
        </div>
        <p className="text-xs text-emerald-200 mt-4">Share this code with friends. You earn 2,500 RWF when they register, and 300 RWF when they invite someone else!</p>
      </Card>

      {/* Downlines List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">My Downlines</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{downlines.length} Users</span>
        </div>
        
        {downlines.length === 0 ? (
          <Card className="p-8 text-center text-gray-500 text-sm flex flex-col items-center">
            <Users size={32} className="text-gray-300 mb-2" />
            <p>No referrals yet.</p>
            <p className="text-xs mt-1">Share your code to start earning!</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {downlines.map((downline) => (
              <Card key={downline.id} className="p-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xs">
                    {downline.phone.slice(-2)}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{downline.phone}</p>
                    <p className="text-[10px] text-gray-500">Joined {new Date(downline.id).toLocaleDateString()}</p> {/* Using UUID as date placeholder */}
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600">+2500 RWF</span>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}