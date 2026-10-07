'use client';
import { useState } from 'react';
import { Search, User } from 'lucide-react';
import { TranscriptSegment } from '../lib/api';

interface TranscriptViewProps {
  segments: TranscriptSegment[];
  currentTime: number;
  onSeek: (time: number) => void;
}

export default function TranscriptView({ segments, currentTime, onSeek }: TranscriptViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const filteredSegments = segments.filter(seg =>
    seg.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seg.speaker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 h-[600px]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-base font-semibold text-slate-100">Interactive Transcript</h2>
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search transcript..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {filteredSegments.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-12">No transcript lines match your search.</p>
        ) : (
          filteredSegments.map((seg) => {
            const isActive = currentTime >= seg.start_time && currentTime <= seg.end_time;
            return (
              <div
                key={seg.id}
                onClick={() => onSeek(seg.start_time)}
                className={`p-3 rounded-xl border transition cursor-pointer flex gap-3 ${
                  isActive
                    ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-100 shadow-md'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <div className="mt-1">
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold text-xs">
                    {seg.speaker.slice(0, 2).toUpperCase()}
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">{seg.speaker}</span>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/50">
                      {formatTime(seg.start_time)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{seg.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}