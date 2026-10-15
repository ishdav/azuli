"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function Register() {
  const [form, setForm] = useState({ phone: "", password: "", confirm: "", invite: "" });
  const { register } = useApp();
  const router = useRouter();

  const handleRegister = () => {
    if (form.password !== form.confirm) return alert("Passwords do not match");
    try {
      register(form.phone, form.password, form.invite);
      router.push("/");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="p-6 h-screen flex flex-col justify-center bg-emerald-800 text-white rounded-b-[40px] shadow-lg">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">AI computing power equipment</h1>
        <p className="text-emerald-200 mt-2 text-sm">Deploy your first node in 60 seconds</p>
      </div>
      
      <Card className="p-6 bg-white text-black">
        <h2 className="text-xl font-bold mb-6">CREATE YOUR ACCOUNT</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Phone number</label>
            <div className="flex items-center border rounded-md px-3 mt-1">
              <span className="text-emerald-600 font-bold mr-2">250</span>
              <input 
                className="w-full py-2 outline-none" 
                placeholder="Enter your mobile number"
                value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <Input type="password" placeholder="Please set the login password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Confirm password</label>
            <Input type="password" placeholder="Please enter your password again" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Invitation code (Required)</label>
            <Input placeholder="e.g. 5XL03D" value={form.invite} onChange={e => setForm({...form, invite: e.target.value})} className="mt-1" />
          </div>
          <Button onClick={handleRegister} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-6 mt-4">
            JOIN NETWORK
          </Button>
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account? <span className="text-emerald-600 font-bold cursor-pointer" onClick={() => router.push("/login")}>Log in now</span>
          </p>
        </div>
      </Card>
    </div>
  );
}