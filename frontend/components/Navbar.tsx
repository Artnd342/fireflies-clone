'use client';
import Link from 'next/link';
import { Video, Mic, Settings, User, Bell } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/30">
            <Mic className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Fireflies<span className="text-indigo-400">.ai</span></span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
          <Settings className="w-5 h-5" />
        </button>
        <div className="h-6 w-[1px] bg-slate-800" />
        <div className="flex items-center gap-3 pl-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm text-white border border-indigo-400">
            AA
          </div>
          <div className="hidden sm:block text-left text-xs">
            <p className="font-semibold text-slate-200">Arpit Anand</p>
            <p className="text-slate-400">Workspace Owner</p>
          </div>
        </div>
      </div>
    </nav>
  );
}