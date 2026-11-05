"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, MessageCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!phone) return alert("Please enter your phone number");
    setLoading(true);
    try {
      await api.requestPasswordReset(phone);
      setSuccess(true);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-slate-50 animate-fade-in">
      <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm mb-8">
        <ChevronLeft size={20} className="text-slate-700" />
      </button>

      <div className="mb-8">
        <div className="w-12 h-12 bg-emerald-100 rounded-xl mb-4 flex items-center justify-center">
          <MessageCircle className="text-emerald-600" size={24} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Forgot Password?</h1>
        <p className="text-sm text-slate-500 mt-2">
          Enter your registered phone number. Our Admin will contact you on WhatsApp to verify your account.
        </p>
      </div>

      {success ? (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center">
          <h3 className="font-bold text-emerald-800 mb-2">Request Submitted!</h3>
          <p className="text-sm text-emerald-600 mb-4">
            Please message the Admin on WhatsApp. You will be asked for your <strong>account balance</strong> to verify your identity.
          </p>
          <Button onClick={() => router.push("/")} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full h-12 rounded-xl">
            Return to Login
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
            <div className="flex items-center border-b-2 border-slate-200 focus-within:border-indigo-600 transition-colors py-3 mt-1">
              <span className="text-slate-400 font-medium mr-3">+250</span>
              <input
                className="w-full outline-none text-lg font-medium bg-transparent placeholder:text-slate-300"
                placeholder="7XX XXX XXX"
                maxLength="9"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold mt-4 shadow-xl shadow-slate-900/20"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Request Password Reset"}
          </Button>
        </div>
      )}
    </div>
  );
}