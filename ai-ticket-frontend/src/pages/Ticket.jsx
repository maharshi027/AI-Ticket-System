import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  SendHorizontal, 
  Calendar, 
  AlertCircle, 
  User, 
  Clock,
  MessageSquare
} from 'lucide-react';

const Ticket = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [history, setHistory] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTicketAndNotes();
  }, [id]);

  const fetchTicketAndNotes = async () => {
    try {
      const hdrs = { Authorization: `Bearer ${token}` };
      const [ticketRes, notesRes, historyRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_SERVER_URL}/tickets/${id}`, { headers: hdrs }),
        fetch(`${import.meta.env.VITE_SERVER_URL}/notes/${id}`, { headers: hdrs }),
        fetch(`${import.meta.env.VITE_SERVER_URL}/tickets/${id}/history`, { headers: hdrs })
      ]);
      
      if (ticketRes.ok) {
        const ticketData = await ticketRes.json();
        setTicket(ticketData.ticket);
      }
      
      if (notesRes.ok) {
        const notesData = await notesRes.json();
        setNotes(notesData.notes || []);
      }

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setHistory(historyData || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/notes/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newNote })
      });
      if (res.ok) {
        setNewNote("");
        fetchTicketAndNotes();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPosting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f8fafc] gap-4">
      <span className="loading loading-ring loading-lg text-primary"></span>
      <p className="text-slate-500 font-medium animate-pulse">Loading your conversation...</p>
    </div>
  );

  if (!ticket) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f8fafc]">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Ticket not found</h2>
        <p className="text-slate-500 mt-2 mb-6">This ticket may have been deleted or moved.</p>
        <Link to="/" className="btn btn-primary rounded-xl">Go Back Home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight truncate max-w-xs md:max-w-md lg:max-w-xl">
                {ticket.title}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">#{id.slice(-6)}</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tighter ${
                  ticket.status === 'Done' ? 'bg-emerald-50 text-emerald-600' : 
                  ticket.status === 'In-Progress' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {ticket.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 p-0 lg:p-8">
        
        {/* SIDEBAR: Metadata (Left Column) */}
        <aside className="lg:col-span-4 space-y-6 order-2 lg:order-1 p-6 lg:p-0">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                <AlertCircle size={16} className="text-primary" /> Ticket Information
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Description</label>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {ticket.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Priority</label>
                    <span className={`text-xs font-bold ${ticket.priority === 'High' ? 'text-red-600' : 'text-slate-700'}`}>
                      {ticket.priority || 'Medium'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Created</label>
                    <span className="text-xs font-bold text-slate-700">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Component */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-6">
            <div className="p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Clock size={16} className="text-primary" /> Activity Timeline
              </h3>
              <div className="space-y-4">
                {history.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No activity yet</p>
                ) : (
                  <ul className="steps steps-vertical w-full text-xs">
                    {history.map((item, idx) => (
                      <li key={item._id} className="step step-primary" data-content={idx === 0 ? "●" : "○"}>
                        <div className="text-left ml-2 w-full">
                          <p className="font-bold text-slate-800">{item.action}</p>
                          <p className="text-[10px] text-slate-500 mb-1">
                            by {item.changedBy?.email} • {new Date(item.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                          </p>
                          {item.oldValue && item.newValue && (
                            <p className="text-[10px] bg-slate-50 px-2 py-1 rounded border border-slate-100 italic text-slate-600">
                              <span className="line-through mr-1 opacity-50">{String(item.oldValue)}</span>
                              <span className="text-primary font-bold">→ {String(item.newValue)}</span>
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN: Chat/Activity (Right Column) */}
        <div className="lg:col-span-8 flex flex-col h-[calc(100vh-160px)] min-h-[500px] order-1 lg:order-2 bg-white lg:rounded-3xl border-x lg:border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <MessageSquare size={16} className="text-slate-400" />
            <span className="text-sm font-bold text-slate-700">Conversation History</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
            {notes.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-40">
                <div className="p-4 bg-slate-100 rounded-full mb-4">
                  <MessageSquare size={32} />
                </div>
                <p className="text-sm font-medium">No activity yet</p>
              </div>
            ) : (
              notes.map(note => {
                const isMine = note.createdBy?._id === user._id || note.createdBy?.email === user.email;
                return (
                  <div key={note._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[85%] ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold uppercase shadow-lg">
                          {note.createdBy?.email?.charAt(0) || <User size={14}/>}
                        </div>
                      </div>
                      <div className={`space-y-1 ${isMine ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 px-1">
                          <span className="text-[10px] font-bold text-slate-500">{note.createdBy?.email?.split('@')[0]}</span>
                          <span className="text-[10px] text-slate-300 font-medium">
                             {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          isMine 
                            ? 'bg-primary text-white rounded-tr-none' 
                            : 'bg-slate-100 text-slate-800 rounded-tl-none'
                        }`}>
                          {note.content}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleAddNote} className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="input input-bordered w-full pr-16 bg-slate-50 border-slate-200 focus:bg-white focus:border-primary rounded-2xl h-14 transition-all"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <button 
                type="submit" 
                className="btn btn-primary btn-sm absolute right-3 rounded-xl h-10 px-4 normal-case" 
                disabled={posting || !newNote.trim()}
              >
                {posting ? <span className="loading loading-spinner"></span> : <><span className="hidden sm:inline">Reply</span> <SendHorizontal size={16} className="ml-1"/></>}
              </button>
            </form>
            <p className="text-[10px] text-center text-slate-400 mt-3 font-medium uppercase tracking-widest">
              Visible to you and support staff
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ticket;