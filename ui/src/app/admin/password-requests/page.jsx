"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, KeyRound, MessageCircle, ShieldAlert } from "lucide-react";

export default function AdminPasswordRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    api.getPasswordRequests().then(data => {
      setRequests(data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleReset = async (requestId, phone) => {
    const newPassword = prompt(`Enter a new temporary LOGIN password for +${phone}:`);
    if (!newPassword) return;
    if (newPassword.length < 6) return alert("Password must be at least 6 characters");

    try {
      await api.resetUserPassword(requestId, newPassword);
      alert(`Login Password reset to: ${newPassword}\n\nNow send it to +${phone} on WhatsApp.`);
      fetchRequests();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleResetWithdraw = async (requestId, phone) => {
    if (!window.confirm(`Clear Withdraw Password for +${phone}?\n\nThey will need to create a new one on their next withdrawal.`)) return;
    
    try {
      await api.resetWithdrawPassword(requestId);
      alert("Withdraw password cleared. User can now create a new one.");
      fetchRequests();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Password Resets</h1>
        <p className="text-slate-500 text-sm mt-1">Manage users requesting password resets via WhatsApp.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Phone Number</TableHead>
              <TableHead>Requested At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10 text-slate-500">No pending password requests.</TableCell>
              </TableRow>
            ) : (
              requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-bold text-slate-900 flex items-center gap-2">
                    <MessageCircle size={14} className="text-emerald-500" />
                    +{req.phone}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {new Date(req.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        onClick={() => handleReset(req.id, req.phone)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs shadow-sm"
                      >
                        <KeyRound size={14} className="mr-1.5" /> Reset Login Pass
                      </Button>
                      <Button 
                        onClick={() => handleResetWithdraw(req.id, req.phone)}
                        className="bg-rose-100 hover:bg-rose-200 text-rose-700 h-8 text-xs shadow-sm border border-rose-200"
                      >
                        <ShieldAlert size={14} className="mr-1.5" /> Clear Withdraw Pass
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}