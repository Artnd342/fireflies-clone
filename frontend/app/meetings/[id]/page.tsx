'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import AudioPlayer from '../../../components/AudioPlayer';
import TranscriptView from '../../../components/TranscriptView';
import SummaryView from '../../../components/SummaryView';
import { fetchMeetingDetail, updateMeeting, Meeting } from '../../../lib/api';
import { ArrowLeft, Edit2, Check, Users, Calendar } from 'lucide-react';

export default function MeetingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekToTime, setSeekToTime] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editParticipants, setEditParticipants] = useState('');

  const loadData = async () => {
    try {
      const data = await fetchMeetingDetail(id);
      setMeeting(data);
      setEditTitle(data.title);
      setEditParticipants(data.participants);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const handleUpdate = async () => {
    if (!meeting) return;
    await updateMeeting(meeting.id, { title: editTitle, participants: editParticipants });
    setIsEditing(false);
    loadData();
  };

  if (!meeting) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-slate-200 flex items-center justify-center">
        <p className="text-sm font-mono animate-pulse">Loading meeting workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        <button
          onClick={() => router.push('/')}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-2 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Meeting Header */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-white font-bold text-xl px-3 py-1 rounded w-full"
                />
                <input
                  type="text"
                  value={editParticipants}
                  onChange={(e) => setEditParticipants(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-slate-300 text-xs px-3 py-1 rounded w-full"
                />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-white tracking-tight">{meeting.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>{new Date(meeting.date).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>{meeting.participants}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div>
            {isEditing ? (
              <button
                onClick={handleUpdate}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Check className="w-4 h-4" /> Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Metadata
              </button>
            )}
          </div>
        </div>

        {/* Main Content Grid: Audio + Transcript & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AudioPlayer
              audioUrl={meeting.audio_url}
              currentTime={currentTime}
              seekToTime={seekToTime}
              onTimeUpdate={(t) => setCurrentTime(t)}
            />
            <TranscriptView
              segments={meeting.transcripts || []}
              currentTime={currentTime}
              onSeek={(t) => setSeekToTime(t)}
            />
          </div>

          <div className="lg:col-span-1">
            <SummaryView meeting={meeting} onRefresh={loadData} />
          </div>
        </div>
      </main>
    </div>
  );
}