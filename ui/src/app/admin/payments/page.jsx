"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPayments = () => {
    api.getPendingPayments().then(data => {
      setPayments(data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleProcess = async (txId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this request?`)) return;
    setActionLoading(txId);
    try {
      await api.processPayment(txId, action);
      fetchPayments(); // Refresh the list
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="h-full flex justify-center mt-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payment Requests</h1>
        <p className="text-slate-500 text-sm mt-1">Approve or reject pending deposits and withdrawals.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>User Phone</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Destination (For Withdraw)</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-slate-500">No pending requests.</TableCell>
                </TableRow>
              ) : (
                payments.map((tx) => {
                  // If withdraw, admin needs to know the net amount (after 20% tax)
                  const isWithdraw = tx.type === "Withdraw";
                  const displayAmount = Math.abs(tx.amount);
                  const netPayout = isWithdraw ? displayAmount * 0.8 : displayAmount;

                  return (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold ${
                          isWithdraw ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                        }`}>
                          {isWithdraw ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                          {tx.type}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">+{tx.userPhone}</TableCell>
                      <TableCell className="font-bold text-slate-900">{displayAmount.toLocaleString()} RWF</TableCell>
                      <TableCell>
                        {isWithdraw ? (
                          <div className="text-xs">
                            <p className="font-bold text-indigo-600">{tx.network} - {tx.phone_number}</p>
                            <p className="text-slate-500 mt-0.5">Payout: <strong className="text-slate-900">{netPayout.toLocaleString()} RWF</strong></p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(tx.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleProcess(tx.id, 'approve')} 
                            disabled={actionLoading === tx.id}
                            className="bg-emerald-600 hover:bg-emerald-700 h-8 px-3 shadow-sm text-white"
                          >
                            {actionLoading === tx.id ? <Loader2 size={14} className="animate-spin" /> : <><CheckCircle2 size={14} className="mr-1"/> Approve</>}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleProcess(tx.id, 'reject')} 
                            disabled={actionLoading === tx.id}
                            className="h-8 px-3 text-rose-600 border-rose-200 hover:bg-rose-50"
                          >
                            <XCircle size={14} className="mr-1"/> Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}