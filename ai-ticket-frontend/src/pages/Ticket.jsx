import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const Ticket = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [notes, setNotes] = useState([]);
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
      const [ticketRes, notesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_SERVER_URL}/tickets/${id}`, { headers: hdrs }),
        fetch(`${import.meta.env.VITE_SERVER_URL}/notes/${id}`, { headers: hdrs })
      ]);
      
      if (ticketRes.ok) {
        const ticketData = await ticketRes.json();
        setTicket(ticketData.ticket);
      }
      
      if (notesRes.ok) {
        const notesData = await notesRes.json();
        setNotes(notesData.notes || []);
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
        fetchTicketAndNotes(); // Refresh notes
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (!ticket) return <div className="min-h-screen flex justify-center items-center"><div className="text-xl">Ticket not found</div></div>;

  return (
    <div className="min-h-screen bg-base-200 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/" className="btn btn-circle btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <h1 className="text-2xl font-bold flex-1 truncate">{ticket.title}</h1>
          <span className={`badge ${ticket.status === 'Done' ? 'badge-success' : ticket.status === 'In-Progress' ? 'badge-warning' : 'badge-ghost'} badge-lg font-semibold`}>
            {ticket.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Col: Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body">
                <h2 className="card-title text-base mb-4">Ticket Details</h2>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="opacity-50 block text-xs uppercase tracking-wide">Created</span>
                    <span className="font-medium">{new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="opacity-50 block text-xs uppercase tracking-wide">Priority</span>
                    <span className={`badge badge-sm mt-1 ${ticket.priority === 'High' ? 'badge-error' : ticket.priority === 'Medium' ? 'badge-warning' : 'badge-success'}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <div>
                    <span className="opacity-50 block text-xs uppercase tracking-wide">Description</span>
                    <p className="mt-1 whitespace-pre-wrap">{ticket.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Notes / Activity */}
          <div className="lg:col-span-2 card bg-base-100 shadow-xl border border-base-200 flex flex-col h-[70vh]">
            <div className="card-header p-6 border-b border-base-200">
              <h2 className="card-title text-base">Activity & Notes</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {notes.length === 0 ? (
                <div className="text-center opacity-50 py-10">No notes yet. Start the conversation!</div>
              ) : (
                notes.map(note => {
                  const isMine = note.createdBy?._id === user._id || note.createdBy?.email === user.email;
                  return (
                    <div key={note._id} className={`chat ${isMine ? 'chat-end' : 'chat-start'}`}>
                      <div className="chat-image avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                          <span className="uppercase text-xs">{note.createdBy?.email?.charAt(0) || '?'}</span>
                        </div>
                      </div>
                      <div className="chat-header opacity-50 text-xs mb-1">
                        {note.createdBy?.email || 'Unknown'} 
                        <time className="ml-2">{new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
                      </div>
                      <div className={`chat-bubble ${isMine ? 'chat-bubble-primary' : 'chat-bubble-base-300'} text-sm`}>
                        {note.content}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 border-t border-base-200 bg-base-100 rounded-b-2xl">
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type a note..." 
                  className="input input-bordered flex-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <button type="submit" className="btn btn-primary px-8" disabled={posting || !newNote.trim()}>
                  {posting ? <span className="loading loading-spinner loading-sm"></span> : "Send"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ticket;
