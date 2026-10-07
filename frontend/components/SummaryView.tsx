'use client';
import { useState } from 'react';
import { Sparkles, CheckSquare, ListChecks, Plus } from 'lucide-react';
import { Meeting, addActionItem, toggleActionItem } from '../lib/api';

interface SummaryViewProps {
  meeting: Meeting;
  onRefresh: () => void;
}

export default function SummaryView({ meeting, onRefresh }: SummaryViewProps) {
  const [newItemText, setNewItemText] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    await addActionItem(meeting.id, newItemText, 'Arpit Anand');
    setNewItemText('');
    onRefresh();
  };

  const handleToggle = async (id: number) => {
    await toggleActionItem(id);
    onRefresh();
  };

  const topicsList = meeting.topics ? meeting.topics.split(',').map(t => t.trim()) : [];

  return (
    <div className="space-y-6">
      {/* AI Executive Summary */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>AI Executive Summary</span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-lg border border-slate-800/60">
          {meeting.summary || 'No AI summary generated for this meeting.'}
        </p>

        {topicsList.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-2">
            {topicsList.map((topic, i) => (
              <span key={i} className="text-[11px] font-medium bg-slate-800 text-indigo-300 px-2.5 py-1 rounded-md border border-slate-700">
                #{topic}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Items CRUD */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm">
            <CheckSquare className="w-4 h-4 text-indigo-400" />
            <span>Action Items & Tasks</span>
          </div>
          <span className="text-xs text-slate-400">
            {meeting.action_items?.filter(a => a.completed).length || 0}/{meeting.action_items?.length || 0} Done
          </span>
        </div>

        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            placeholder="Add new action item..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition">
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>

        <div className="space-y-2">
          {meeting.action_items?.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No action items assigned yet.</p>
          ) : (
            meeting.action_items?.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggle(item.id)}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                  item.completed
                    ? 'bg-slate-950/40 border-slate-800/40 text-slate-500 line-through'
                    : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => {}}
                    className="rounded accent-indigo-600 border-slate-700"
                  />
                  <span className="text-xs font-medium">{item.text}</span>
                </div>
                {item.assignee && (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                    {item.assignee}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}