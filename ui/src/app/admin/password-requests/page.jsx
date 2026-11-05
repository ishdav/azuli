"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, KeyRound, MessageCircle } from "lucide-react";

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
    const newPassword = prompt(`Enter a new temporary password for user +${phone}:`);
    if (!newPassword) return;
    
    if (newPassword.length < 6) return alert("Password must be at least 6 characters");

    try {
      await api.resetUserPassword(requestId, newPassword);
      alert(`Password reset to: ${newPassword}\n\nNow go to WhatsApp and send it to +${phone}`);
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
              <TableHead className="text-right">Action</TableHead>
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
                    <Button 
                      onClick={() => handleReset(req.id, req.phone)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs shadow-sm"
                    >
                      <KeyRound size={14} className="mr-2" /> Reset & Copy Password
                    </Button>
                  </TableCell>
                  // Inside the map for requests:
<Button 
  onClick={() => handleResetWithdraw(req.id, req.phone)}
  className="bg-rose-600 hover:bg-rose-700 text-white h-8 text-xs shadow-sm ml-2"
>
  Reset Withdraw Pass
</Button>

const handleResetWithdraw = async (requestId, phone) => {
  if (!window.confirm(`Reset Withdraw Password for +${phone}? They will need to create a new one on their next withdrawal.`)) return;
  try {
    await api.resetWithdrawPassword(requestId); // Add this to api.js
    alert("Withdraw password cleared. User can now create a new one.");
    fetchRequests();
  } catch (e) {
    alert(e.message);
  }
};
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}