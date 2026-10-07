const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ActionItem {
  id: number;
  meeting_id: number;
  text: string;
  assignee?: string;
  completed: boolean;
}

export interface TranscriptSegment {
  id: number;
  meeting_id: number;
  speaker: string;
  start_time: number;
  end_time: number;
  text: string;
}

export interface Meeting {
  id: number;
  title: string;
  date: string;
  duration_seconds: number;
  participants: string;
  audio_url?: string;
  summary?: string;
  topics?: string;
  action_items?: ActionItem[];
  transcripts?: TranscriptSegment[];
}

export async function fetchMeetings(search: string = ''): Promise<Meeting[]> {
  const res = await fetch(`${API_BASE_URL}/meetings?search=${encodeURIComponent(search)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch meetings');
  return res.json();
}

export async function fetchMeetingDetail(id: string): Promise<Meeting> {
  const res = await fetch(`${API_BASE_URL}/meetings/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch meeting detail');
  return res.json();
}

export async function createMeeting(data: { title: string; participants: string; transcript_raw?: string }): Promise<Meeting> {
  const res = await fetch(`${API_BASE_URL}/meetings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create meeting');
  return res.json();
}

export async function updateMeeting(id: number, data: { title?: string; participants?: string }): Promise<Meeting> {
  const res = await fetch(`${API_BASE_URL}/meetings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update meeting');
  return res.json();
}

export async function deleteMeeting(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/meetings/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete meeting');
}

export async function addActionItem(meetingId: number, text: string, assignee?: string): Promise<ActionItem> {
  const res = await fetch(`${API_BASE_URL}/meetings/${meetingId}/action-items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, assignee, completed: false }),
  });
  if (!res.ok) throw new Error('Failed to add action item');
  return res.json();
}

export async function toggleActionItem(itemId: number): Promise<ActionItem> {
  const res = await fetch(`${API_BASE_URL}/action-items/${itemId}`, { method: 'PATCH' });
  if (!res.ok) throw new Error('Failed to toggle action item');
  return res.json();
}