'use client';
import { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, SkipBack, SkipForward } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl?: string;
  currentTime: number;
  seekToTime: number | null;
  onTimeUpdate: (time: number) => void;
}

export default function AudioPlayer({ audioUrl, currentTime, seekToTime, onTimeUpdate }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (seekToTime !== null && audioRef.current) {
      audioRef.current.currentTime = seekToTime;
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [seekToTime]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 shadow-md">
      <audio
        ref={audioRef}
        src={audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'}
        onTimeUpdate={() => audioRef.current && onTimeUpdate(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
      />

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <input
        type="range"
        min={0}
        max={duration || 100}
        value={currentTime}
        onChange={(e) => {
          const val = Number(e.target.value);
          if (audioRef.current) audioRef.current.currentTime = val;
          onTimeUpdate(val);
        }}
        className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
      />

      <div className="flex items-center justify-center gap-6">
        <button onClick={() => audioRef.current && (audioRef.current.currentTime -= 5)} className="text-slate-400 hover:text-white transition">
          <SkipBack className="w-5 h-5" />
        </button>
        <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition">
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <button onClick={() => audioRef.current && (audioRef.current.currentTime += 5)} className="text-slate-400 hover:text-white transition">
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}