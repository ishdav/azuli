"use client";
import { useState, Suspense, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

// ✅ Inner component that uses useSearchParams
function RegisterForm() {
  const searchParams = useSearchParams();
  const inviteFromUrl = searchParams.get("invite") || ""; // Get code from URL
  
  const [form, setForm] = useState({
    phone: "",
    password: "",
    confirm: "",
    inviteCode: inviteFromUrl, // Pre-fill the state
  });
  const [loading, setLoading] = useState(false);
  const { register, user } = useApp();
  const router = useRouter();

  // If the URL changes (e.g., user navigates to a different invite link), update the field
  useEffect(() => {
    if (inviteFromUrl) {
      setForm((prev) => ({ ...prev, inviteCode: inviteFromUrl }));
    }
  }, [inviteFromUrl]);

  useEffect(() => {
    if (user) router.push("/home");
  }, [user, router]);

  const handleRegister = async () => {
    if (!form.phone || !form.password) return alert("Please fill all required fields");
    if (form.password !== form.confirm) return alert("Passwords do not match");

    setLoading(true);
    try {
      await register(form.phone, form.password, form.inviteCode);
      router.push("/home");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 bg-emerald-800 text-white animate-fade-in">
      <div className="mb-10 text-center mt-10">
        <h1 className="text-3xl font-bold">AI computing power equipment</h1>
        <p className="text-emerald-200 mt-2 text-sm">Deploy your first node in 60 seconds</p>
      </div>

      <Card className="p-6 bg-white text-black shadow-2xl rounded-3xl border-none">
        <h2 className="text-xl font-bold mb-6">CREATE YOUR ACCOUNT</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase">Phone number</label>
            <div className="flex items-center border border-slate-200 rounded-xl px-3 mt-1 bg-slate-50 focus-within:border-indigo-500 transition-colors">
              <span className="text-slate-500 font-bold mr-2">+250</span>
              <input
                className="w-full py-3 outline-none bg-transparent text-sm font-medium"
                placeholder="Enter your mobile number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase">Password</label>
            <Input
              type="password"
              placeholder="Please set the login password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 h-11 bg-slate-50"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase">Confirm password</label>
            <Input
              type="password"
              placeholder="Please enter your password again"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="mt-1 h-11 bg-slate-50"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase">Invitation code</label>
            <Input
              placeholder="e.g. GENESIS"
              value={form.inviteCode}
              onChange={(e) => setForm({ ...form, inviteCode: e.target.value })}
              className={`mt-1 h-11 bg-slate-50 font-mono tracking-wider ${
                form.inviteCode ? "border-emerald-500 bg-emerald-50 text-emerald-800" : ""
              }`}
            />
            {form.inviteCode && (
              <p className="text-[10px] text-emerald-600 mt-1 font-bold">
                ✅ Invitation code applied from link
              </p>
            )}
          </div>
          
          <Button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-6 mt-4 rounded-xl font-bold text-base shadow-lg shadow-emerald-700/30"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "JOIN NETWORK"}
            {!loading && <ArrowRight size={18} className="ml-2" />}
          </Button>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link href="/" className="text-emerald-600 font-bold hover:underline">
              Log in now
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

// ✅ Main component wraps the form in Suspense
export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}