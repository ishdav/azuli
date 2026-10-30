"use client";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, User } from "lucide-react";
import Image from "next/image";
import Logo from "../../public/logo.svg"; // Adjust path if necessary

export default function LoginPage() {
  const [form, setForm] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login, user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/home");
  }, [user, router]);

  const handleLogin = async () => {
    if (!form.phone || !form.password) return alert("Please fill all fields");
    setLoading(true);
    try {
      await login(form.phone, form.password);
      router.push("/home");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Added 'relative' to the main container for absolute positioning
    <div className="relative min-h-screen flex flex-col justify-center p-6 bg-white animate-fade-in">
      
      {/* ✅ Top Right Branding (Logo + Name) */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <Image 
          src={Logo} 
          alt="Azuli Logo" 
          width={32} 
          height={32} 
          className="w-8 h-8 object-contain" 
        />
        <span className="font-bold text-xl text-slate-900 tracking-tight">Azuli</span>
      </div>

      <div className="mb-12 mt-10">
        {/* Changed the icon to something more premium */}
        <div className="w-12 h-12 bg-indigo-600 rounded-xl mb-6 flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <User className="text-white" size={24} />
        </div>
        
        <div className="flex">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back to Azuli seka</h1>
        </div>
        <p className="text-sm text-slate-500 mt-2">Enter your credentials to access your portfolio.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
          <div className="flex items-center border-b-2 border-slate-200 focus-within:border-indigo-600 transition-colors py-3 mt-1">
            <span className="text-slate-400 font-medium mr-3">+250</span>
            <input
              className="w-full outline-none text-lg font-medium bg-transparent placeholder:text-slate-300"
              placeholder="7XX XXX XXX"
              maxLength="9"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>
        
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
          <div className="border-b-2 border-slate-200 focus-within:border-indigo-600 transition-colors py-3 mt-1">
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full outline-none text-lg font-medium bg-transparent placeholder:text-slate-300"
            />
          </div>
        </div>

        <Button
          onClick={handleLogin}
          disabled={loading}
          className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-base mt-8 shadow-xl shadow-slate-900/20"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
          {!loading && <ArrowRight size={18} className="ml-2" />}
        </Button>
        
        <p className="text-center text-sm text-slate-500 pt-4">
          Don&apos;t have an account?{" "}
          <span
            className="text-indigo-600 font-bold cursor-pointer hover:underline"
            onClick={() => router.push("/register")}
          >
            Apply for access
          </span>
        </p>
      </div>
    </div>
  );
}
