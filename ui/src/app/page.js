"use client";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const [form, setForm] = useState({ phone: "", password: "" });
  const { login, user } = useApp();
  const router = useRouter();

  // If already logged in, go to home
  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  const handleLogin = () => {
    try {
      login(form.phone, form.password);
      router.push("/home");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="p-6 h-screen flex flex-col justify-center bg-emerald-800 text-white rounded-b-[40px] shadow-lg">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">AI computing power equipment</h1>
        <p className="text-emerald-200 mt-2 text-sm">Log in to your account</p>
      </div>

      <Card className="p-6 bg-white text-black">
        <h2 className="text-xl font-bold mb-6">LOGIN</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Phone number</label>
            <div className="flex items-center border rounded-md px-3 mt-1">
              <span className="text-emerald-600 font-bold mr-2">250</span>
              <input
                className="w-full py-2 outline-none"
                placeholder="Enter your mobile number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleLogin}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-6 mt-4"
          >
            LOG IN
          </Button>
          <p className="text-center text-sm text-gray-500 mt-4">
            Don&apos;t have an account?{" "}
            <span
              className="text-emerald-600 font-bold cursor-pointer"
              onClick={() => router.push("/register")}
            >
              Register now
            </span>
          </p>
        </div>
      </Card>
    </div>
  );
}