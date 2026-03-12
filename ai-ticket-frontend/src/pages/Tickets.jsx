import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Tickets() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to Fetch Tickets: ", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setForm({ title: "", description: "" });
        document.getElementById('create_ticket_modal').close();
        fetchTickets();
      } else {
        alert("Failed to create ticket");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-sm px-4 lg:px-8">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl font-bold tracking-tight">AI Ticket System</Link>
        </div>
        <div className="flex-none gap-4">
          {user?.role === 'admin' && (
             <Link to="/admin" className="btn btn-outline btn-sm">Admin Panel</Link>
          )}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-10">
                <span className="uppercase">{user?.email?.charAt(0) || 'U'}</span>
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li className="menu-title px-4 py-2 opacity-60 text-xs">{user?.email}</li>
              <li><button onClick={handleLogout} className="text-error">Logout</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-base-content">My Tickets</h1>
            <p className="text-sm opacity-70 mt-1">Manage and track your support requests</p>
          </div>
          <button 
            className="btn btn-primary shadow-lg shadow-primary/30"
            onClick={() => document.getElementById('create_ticket_modal').showModal()}
          >
            Create New Ticket
          </button>
        </div>

        {fetching ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="card bg-base-100 shadow-xl p-10 text-center border border-base-300">
            <h3 className="text-xl font-semibold mb-2">No tickets found</h3>
            <p className="opacity-70 mb-6">You haven't created any tickets yet.</p>
            <button 
              className="btn btn-outline btn-primary"
              onClick={() => document.getElementById('create_ticket_modal').showModal()}
            >
              Create Your First Ticket
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <Link to={`/ticket/${ticket._id}`} key={ticket._id} className="card bg-base-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-base-200">
                <div className="card-body">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`badge ${ticket.status === 'Done' ? 'badge-success' : ticket.status === 'In-Progress' ? 'badge-warning' : 'badge-ghost'} badge-sm font-semibold`}>
                      {ticket.status}
                    </span>
                    <span className="text-xs opacity-50">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h2 className="card-title text-lg truncate leading-tight mb-2">{ticket.title}</h2>
                  <p className="text-sm opacity-70 line-clamp-3 mb-4">{ticket.description}</p>
                  <div className="card-actions justify-end mt-auto">
                    <span className="text-xs font-semibold text-primary group-hover:underline flex items-center gap-1">
                      View Details &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* DaisyUI Modal */}
      <dialog id="create_ticket_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg mb-4">Create a New Ticket</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Title</span>
              </label>
              <input 
                type="text" 
                name="title" 
                placeholder="Brief summary of the issue..." 
                className="input input-bordered w-full bg-base-200/50 focus:bg-base-100" 
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Description</span>
              </label>
              <textarea 
                name="description" 
                className="textarea textarea-bordered h-32 bg-base-200/50 focus:bg-base-100" 
                placeholder="Detailed description..."
                value={form.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : "Submit Ticket"}
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default Tickets;
