"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/services/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Edit, Check, X, Trash2, Plus, Minus, Search, UserCircle2 } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = () => {
    api.getAllUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSave = async (id) => {
    setActionLoading(true);
    try {
      await api.updateUserBalance(id, editValue);
      setEditingId(null);
      fetchUsers();
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdjust = async (id, amount) => {
    setActionLoading(true);
    try {
      await api.adjustUserBalance(id, amount);
      fetchUsers();
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to permanently delete this user?")) {
      await api.deleteUser(id);
      fetchUsers();
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => u.phone.includes(searchQuery) || u.inviteCode.includes(searchQuery.toUpperCase()));
  }, [users, searchQuery]);

  if (loading) return <div className="h-full flex items-center justify-center mt-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-1">Manage balances, view nodes, and restrict access.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by phone or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/80 border-b border-slate-200">
              <TableRow>
                <TableHead className="font-semibold text-slate-600 py-4 pl-6">User</TableHead>
                <TableHead className="font-semibold text-slate-600 py-4">Invite Code</TableHead>
                <TableHead className="font-semibold text-slate-600 py-4 text-center">Nodes</TableHead>
                <TableHead className="font-semibold text-slate-600 py-4">Balance (RWF)</TableHead>
                <TableHead className="text-right font-semibold text-slate-600 py-4 pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-500 font-medium">No users found matching your search.</TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                    
                    {/* User Cell */}
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {user.phone.slice(-2)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">+{user.phone}</p>
                          <p className="text-[11px] text-slate-500 font-medium">ID: {user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </TableCell>
                    
                    {/* Invite Code Cell */}
                    <TableCell className="py-4">
                      <Badge variant="outline" className="bg-slate-100 text-slate-700 font-mono text-xs px-2.5 py-1 border-slate-200 shadow-sm">
                        {user.inviteCode}
                      </Badge>
                    </TableCell>
                    
                    {/* Nodes Cell */}
                    <TableCell className="py-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-slate-100 text-slate-700 font-bold text-xs">
                        {user.nodeCount || 0}
                      </span>
                    </TableCell>
                    
                    {/* Balance Cell */}
                    <TableCell className="py-4">
                      {editingId === user.id ? (
                        <input 
                          type="number" 
                          value={editValue} 
                          onChange={e => setEditValue(e.target.value)}
                          className="w-28 border-2 border-indigo-400 rounded-lg px-3 py-1.5 text-sm font-bold outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                          autoFocus
                        />
                      ) : (
                        <span className="font-bold text-slate-900 text-base">
                          {user.balance.toLocaleString()}
                        </span>
                      )}
                    </TableCell>
                    
                    {/* Actions Cell */}
                    <TableCell className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {editingId === user.id ? (
                          <>
                            <Button size="sm" onClick={() => handleSave(user.id)} disabled={actionLoading} className="bg-emerald-600 hover:bg-emerald-700 h-9 px-3 shadow-sm">
                              <Check size={16} className="mr-1.5"/> Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="h-9 px-3 border-slate-200">
                              <X size={16} />
                            </Button>
                          </>
                        ) : (
                          <>
                            {/* Quick +/- Buttons */}
                            <div className="flex items-center bg-slate-100 rounded-lg p-1 mr-2 shadow-inner">
                              <button onClick={() => handleAdjust(user.id, -1000)} disabled={actionLoading} className="p-1.5 text-rose-600 hover:bg-white rounded-md transition-all" title="-1,000">
                                <Minus size={14} />
                              </button>
                              <div className="w-px h-4 bg-slate-300 mx-1"></div>
                              <button onClick={() => handleAdjust(user.id, 1000)} disabled={actionLoading} className="p-1.5 text-emerald-600 hover:bg-white rounded-md transition-all" title="+1,000">
                                <Plus size={14} />
                              </button>
                            </div>
                            
                            {/* Edit & Delete Buttons */}
                            <Button size="sm" variant="outline" onClick={() => { setEditingId(user.id); setEditValue(user.balance); }} className="h-9 px-3 border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-sm">
                              <Edit size={14} className="mr-1.5"/> Edit
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete(user.id)} className="h-9 w-9 p-0 border-slate-200 text-rose-500 hover:text-rose-700 hover:border-rose-300 hover:bg-rose-50 shadow-sm">
                              <Trash2 size={15}/>
                            </Button>
                          </>
                        )}
                        
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}