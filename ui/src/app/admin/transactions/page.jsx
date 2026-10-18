"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function AdminTransactionsPage() {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllTransactions().then(data => {
      setTxs(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Transactions</h1>
        <p className="text-slate-500 text-sm mt-1">Monitor all financial activities.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User Phone</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {txs.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="text-slate-500">{new Date(tx.date).toLocaleString()}</TableCell>
                <TableCell className="font-medium text-slate-900">+{tx.userPhone}</TableCell>
                <TableCell>
                  <span className="font-semibold text-slate-700">{tx.type}</span>
                </TableCell>
                <TableCell className={tx.amount < 0 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>
                  {tx.amount < 0 ? "" : "+"}{tx.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge className={
                    tx.status === 'Success' ? "bg-emerald-100 text-emerald-700" : 
                    "bg-amber-100 text-amber-700"
                  }>
                    {tx.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}