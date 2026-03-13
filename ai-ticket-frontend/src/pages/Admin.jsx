import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Ticket, 
  Users, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

const Admin = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch all tickets", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setTickets(tickets.map(t => t._id === id ? { ...t, status: newStatus } : t));
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  // Stats calculation
  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === 'To-Do').length,
    active: tickets.filter(t => t.status === 'In-Progress').length,
    completed: tickets.filter(t => t.status === 'Done').length,
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f8fafc]">
      <span className="loading loading-infinity loading-lg text-primary"></span>
      <p className="text-slate-500 font-bold mt-4 animate-pulse uppercase tracking-widest text-xs">Accessing Secure Data</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* --- ADMIN SIDEBAR --- */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white p-6 fixed h-full">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-primary p-2 rounded-xl">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Admin OS</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link to="/" className="flex items-center gap-3 p-3 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} /> Exit to User View
          </Link>
          <div className="pt-4 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Management</div>
          <Link to="/admin" className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg text-primary border border-primary/20">
            <LayoutDashboard size={18} /> Overview
          </Link>
          <button className="flex items-center gap-3 p-3 w-full text-slate-400 hover:text-white transition-colors">
            <Users size={18} /> User Database
          </button>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global Control</h1>
          <p className="text-slate-500">Monitor and manage every support request in the system.</p>
        </header>

        {/* STATS STRIP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Volume', value: stats.total, icon: Ticket, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'New/Pending', value: stats.pending, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'In Progress', value: stats.active, icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Resolved', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-4`}>
                <s.icon size={20} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-800">Recent Tickets</h2>
            <div className="badge badge-outline border-slate-200 text-slate-500 py-3 px-4 rounded-lg text-xs font-bold">
              LATEST UPDATE: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-4 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Ticket Details</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Requester</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Assignee</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Global Status</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-20">
                      <div className="flex flex-col items-center opacity-30">
                        <Ticket size={48} />
                        <p className="mt-2 font-bold uppercase tracking-widest text-xs">No Records Found</p>
                      </div>
                    </td>
                  </tr>
                ) : tickets.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-5 px-6">
                      <div className="font-bold text-slate-800 group-hover:text-primary transition-colors">{t.title}</div>
                      <div className="text-xs text-slate-400 line-clamp-1 mt-1 max-w-[200px]">{t.description}</div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {t.createdBy?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-700">{t.createdBy || 'Anonymous'}</div>
                          <div className="text-[10px] text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      {t.assignedTo ? (
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                           <span className="text-xs font-medium text-slate-600">{t.assignedTo.email}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-300 uppercase italic">Waiting...</span>
                      )}
                    </td>
                    <td className="py-5 px-6">
                      <select 
                        className={`select select-sm select-bordered rounded-xl font-bold text-[11px] w-full max-w-[140px] focus:outline-none transition-all ${
                          t.status === 'Done' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                          t.status === 'In-Progress' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 
                          'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                        value={t.status}
                        onChange={(e) => updateStatus(t._id, e.target.value)}
                      >
                        <option value="To-Do">To-Do</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </td>
                    <td className="py-5 px-6">
                      <Link 
                        to={`/ticket/${t._id}`} 
                        className="btn btn-ghost btn-sm rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary transition-all"
                      >
                        <ExternalLink size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;