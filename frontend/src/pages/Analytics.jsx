import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import {
  LogOutIcon,
  LayoutDashboardIcon,
  TicketIcon,
  ShieldCheckIcon,
  BarChartIcon,
} from "lucide-react";

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets/stats`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner text-primary"></span></div>;
  if (!stats) return <div className="text-center mt-10">Failed to load analytics or unauthorized. Only Admins & Moderators can view this.</div>;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* --- SIDEBAR --- */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white p-6 fixed h-full z-20">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-primary p-2 rounded-xl">
            <TicketIcon size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Supportly</span>
        </div>

        <nav className="flex-1 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <LayoutDashboardIcon size={20} /> Dashboard
          </Link>
          {(user?.role === "admin" || user?.role === "moderator") && (
            <Link
              to="/analytics"
              className="flex items-center gap-3 p-3 bg-white/10 rounded-lg text-white"
            >
              <BarChartIcon size={20} /> Analytics
            </Link>
          )}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <ShieldCheckIcon size={20} /> Admin Portal
            </Link>
          )}
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full text-slate-400 hover:text-error transition-colors"
          >
            <LogOutIcon size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Analytics Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stats shadow bg-primary text-primary-content">
          <div className="stat">
            <div className="stat-title text-primary-content opacity-75">Total Tickets</div>
            <div className="stat-value">{stats.totalTickets}</div>
          </div>
        </div>
        
        <div className="stats shadow bg-secondary text-secondary-content">
          <div className="stat">
            <div className="stat-title text-secondary-content opacity-75">Open Tickets</div>
            <div className="stat-value">{stats.openTickets}</div>
          </div>
        </div>

        <div className="stats shadow bg-accent text-accent-content">
          <div className="stat">
            <div className="stat-title text-accent-content opacity-75">Resolved Tickets</div>
            <div className="stat-value">{stats.resolvedTickets}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Status Breakdown */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <h2 className="card-title">Tickets by Status</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th className="text-base text-base-content">Status</th>
                    <th className="text-base text-base-content">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.statusStats?.length > 0 ? stats.statusStats.map(stat => (
                    <tr key={stat._id}>
                      <td className="font-semibold">{stat._id}</td>
                      <td>{stat.count}</td>
                    </tr>
                  )) : <tr><td colSpan="2" className="text-center">No status data</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <h2 className="card-title">Tickets by Priority</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th className="text-base text-base-content">Priority</th>
                    <th className="text-base text-base-content">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.priorityStats?.length > 0 ? stats.priorityStats.map(stat => (
                    <tr key={stat._id}>
                      <td className="font-semibold">{stat._id}</td>
                      <td>{stat.count}</td>
                    </tr>
                  )) : <tr><td colSpan="2" className="text-center">No priority data</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
