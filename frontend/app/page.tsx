'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { fetchMeetings, createMeeting, deleteMeeting, Meeting } from '../lib/api';
import { Plus, Search, Calendar, Clock, Users, Trash2, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [participants, setParticipants] = useState('');
  const [transcriptRaw, setTranscriptRaw] = useState('');

  const loadMeetings = async () => {
    try {
      const data = await fetchMeetings(search);
      setMeetings(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !participants) return;
    await createMeeting({ title, participants, transcript_raw: transcriptRaw });
    setTitle('');
    setParticipants('');
    setTranscriptRaw('');
    setShowModal(false);
    loadMeetings();
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this meeting?')) {
      await deleteMeeting(id);
      loadMeetings();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Meetings Library</h1>
            <p className="text-xs text-slate-400 mt-1">Browse, search, and analyze your meeting transcripts & AI notes.</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition self-start"
          >
            <Plus className="w-4 h-4" /> New Meeting
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search meetings by title, participant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 shadow-inner"
          />
        </div>

        {/* Meetings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {meetings.map((m) => (
            <Link key={m.id} href={`/meetings/${m.id}`}>
              <div className="bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 space-y-4 hover:shadow-xl hover:shadow-indigo-950/20 transition group relative">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-slate-100 group-hover:text-indigo-400 transition text-base line-clamp-1">
                    {m.title}
                  </h2>
                  <button
                    onClick={(e) => handleDelete(m.id, e)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {m.summary || 'No summary available.'}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{new Date(m.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="truncate">{m.participants}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Modal for Creating Meeting */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white">Upload / Create Meeting</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Strategy Review"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Participants</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arpit Anand, Sarah Chen"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Transcript Text (Optional)</label>
                <textarea
                  rows={4}
                  placeholder="Paste meeting transcript here..."
                  value={transcriptRaw}
                  onChange={(e) => setTranscriptRaw(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                >
                  Save Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}