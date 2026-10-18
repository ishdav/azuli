"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.adminLogin(form.username, form.password);
      router.push("/admin");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <ShieldCheck size={32} className="text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white text-center mb-2">Admin Portal</h1>
        <p className="text-slate-400 text-center text-sm mb-8">Restricted Access</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Username</label>
            <Input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="mt-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-600"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-600"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-12 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
            {loading ? <Loader2 className="animate-spin" /> : "Login to Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
}