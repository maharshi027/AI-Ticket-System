import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PlusIcon,
  LogOutIcon,
  LayoutDashboardIcon,
  TicketIcon,
  SearchIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  X, // Added missing import
  PenLine, // Added missing import
} from "lucide-react";

function Tickets() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ title: "", description: "" });
        document.getElementById("create_ticket_modal").close();
        fetchTickets();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredTickets = tickets.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
            to="/tickets"
            className="flex items-center gap-3 p-3 bg-white/10 rounded-lg text-white"
          >
            <LayoutDashboardIcon size={20} /> Dashboard
          </Link>
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
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back!
            </h1>
            <p className="text-slate-500">
              Here's what's happening with your tickets.
            </p>
          </div>
          <button
            className="btn btn-primary btn-md shadow-lg shadow-blue-500/20 px-6 rounded-xl normal-case"
            onClick={() =>
              document.getElementById("create_ticket_modal").showModal()
            }
          >
            <PlusIcon size={18} /> New Ticket
          </button>
        </header>

        {/* Search & Stats */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by title..."
              className="input input-bordered w-full pl-12 bg-white border-slate-200 focus:border-primary rounded-xl"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center bg-white px-4 py-2 rounded-xl border border-slate-200">
            <span className="text-sm font-medium text-slate-500">Total:</span>
            <span className="badge badge-ghost font-bold">
              {tickets.length}
            </span>
          </div>
        </div>

        {/* Tickets Grid */}
        {fetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 p-6 rounded-full mb-4">
              <TicketIcon size={48} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              No tickets found
            </h3>
            <p className="text-slate-500 mb-6 text-center max-w-xs">
              Try adjusting your search or create a new support request.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <Link
                to={`/ticket/${ticket._id}`}
                key={ticket._id}
                className="group relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ticket.status === "Done"
                        ? "bg-emerald-50 text-emerald-600"
                        : ticket.status === "In-Progress"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {ticket.status || "Pending"}
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 uppercase">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {ticket.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-6 h-10 italic">
                  {ticket.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <span className="text-xs font-bold text-primary flex items-center gap-1">
                    Manage <ChevronRightIcon size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* --- BEAUTIFIED MODAL --- */}
      <dialog id="create_ticket_modal" className="modal overflow-hidden">
        <div className="modal-box max-w-lg rounded-[32px] p-0 border border-white/20 shadow-2xl bg-white overflow-hidden">
          {/* Header with Dark Background */}
          <div className="bg-slate-900 px-8 py-10 text-white relative">
            <button
              type="button"
              className="absolute right-6 top-6 p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
              onClick={() =>
                document.getElementById("create_ticket_modal").close()
              }
            >
              <X size={20} />
            </button>
            <div className="bg-primary/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border border-primary/30">
              <PenLine className="text-primary" size={24} />
            </div>
            <h3 className="text-2xl font-black tracking-tight">
              Create New Ticket
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Submit your request and our AI will route it to the right team.
            </p>
          </div>

          {/* Form Body */}
          <div className="p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input Group */}
              <div className="form-control w-full">
                <label className="flex items-center gap-2 mb-2 px-1">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                    Subject
                  </span>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </label>
                <input
                  name="title"
                  // Added 'text-slate-900' and 'bg-white' for maximum visibility
                  className="input input-bordered w-full pl-4 bg-white text-slate-900 border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-2xl transition-all h-14 font-medium"
                  placeholder="e.g. Server connection timeout"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Description Textarea Group */}
              <div className="form-control w-full">
                <label className="flex items-center gap-2 mb-2 px-1">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                    Details
                  </span>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </label>
                <textarea
                  name="description"
                  // Added 'text-slate-900' and 'bg-white'
                  className="textarea textarea-bordered w-full p-4 bg-white text-slate-900 border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-2xl transition-all h-32 font-medium leading-relaxed"
                  placeholder="Tell us more about your issue..."
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  className="btn flex-1 h-14 rounded-2xl border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold"
                  onClick={() =>
                    document.getElementById("create_ticket_modal").close()
                  }
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-[2] h-14 rounded-2xl shadow-lg shadow-primary/25 font-black text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Launch Ticket"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Backdrop */}
        <form
          method="dialog"
          className="modal-backdrop bg-slate-900/60 backdrop-blur-md"
        >
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default Tickets;
