"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function CheckinError({ error, reset }) {
  useEffect(() => {
    // This will print the real error to the browser console
    console.error("Checkin page crashed:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 bg-slate-50">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Check-in failed to load</h2>
      <p className="text-sm text-slate-500 mb-6 text-center">{error.message}</p>
      <div className="flex gap-3">
        <Button onClick={() => reset()} className="bg-indigo-600">Try again</Button>
        <Button variant="outline" onClick={() => window.location.reload()}>Reload Page</Button>
      </div>
    </div>
  );
}