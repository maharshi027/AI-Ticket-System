import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
        // Optimistically update
        setTickets(tickets.map(t => t._id === id ? { ...t, status: newStatus } : t));
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner text-primary"></span></div>;

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-sm px-4 lg:px-8">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl font-bold tracking-tight">AI Ticket System <span className="text-primary text-sm tracking-normal">Admin</span></Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Manage All Tickets</h1>
        
        <div className="bg-base-100 rounded-box shadow-xl border border-base-200 overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200/50">
                <th>Title & Desc</th>
                <th>Created By</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-6 opacity-50">No tickets found in the system.</td></tr>
              ) : tickets.map((t) => (
                <tr key={t._id}>
                  <td>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-xs opacity-60 line-clamp-1 max-w-xs">{t.description}</div>
                  </td>
                  <td>
                    <div className="text-sm opacity-80">{t.createdBy || 'Unknown'}</div>
                    <div className="text-xs opacity-50">{new Date(t.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td>
                    {t.assignedTo ? (
                      <span className="badge badge-sm badge-outline">{t.assignedTo.email}</span>
                    ) : (
                      <span className="opacity-50 text-sm italic">Unassigned</span>
                    )}
                  </td>
                  <td>
                    <select 
                      className={`select select-sm select-bordered w-full max-w-xs ${
                        t.status === 'Done' ? 'select-success text-success' : 
                        t.status === 'In-Progress' ? 'select-warning text-warning' : ''
                      }`}
                      value={t.status}
                      onChange={(e) => updateStatus(t._id, e.target.value)}
                    >
                      <option value="To-Do">To-Do</option>
                      <option value="In-Progress">In-Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>
                  <td>
                    <Link to={`/ticket/${t._id}`} className="btn btn-sm btn-ghost text-primary text-xs">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
