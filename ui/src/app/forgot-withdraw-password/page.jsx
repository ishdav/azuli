"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, MessageCircle } from "lucide-react";

export default function ForgotWithdrawPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // We will reuse the password reset request logic, but tell admin it's for withdraw
      await api.requestPasswordReset("WITHDRAW_RESET"); // We will handle this specifically in the backend
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
        <div className="w-12 h-12 bg-rose-100 rounded-xl mb-4 flex items-center justify-center">
          <MessageCircle className="text-rose-600" size={24} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Forgot Withdraw Password?</h1>
        <p className="text-sm text-slate-500 mt-2">
          For your security, withdrawal passwords cannot be reset automatically. Click below to request a reset from the Admin via WhatsApp.
        </p>
      </div>

      {success ? (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center">
          <h3 className="font-bold text-emerald-800 mb-2">Request Submitted!</h3>
          <p className="text-sm text-emerald-600 mb-4">
            Message the Admin on WhatsApp. They will verify your identity and reset your withdraw password.
          </p>
          <Button onClick={() => router.push("/home")} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full h-12 rounded-xl">
            Return to Dashboard
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold mt-4 shadow-xl shadow-slate-900/20"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Request Admin Reset"}
        </Button>
      )}
    </div>
  );
}