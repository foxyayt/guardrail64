import React, { useState } from 'react';
import { SpeedTestResult, NetworkGrade } from '../types';
import { Wifi, Upload, Download, Activity, Trophy, Monitor, Gamepad2, Share2, Check, RefreshCw } from 'lucide-react';

interface ResultCardProps {
  results: SpeedTestResult;
  grade: NetworkGrade;
  onRestart: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ results, grade, onRestart }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = `My Guardrail64 Result:\nDown: ${results.downloadSpeed.toFixed(1)} Mbps\nUp: ${results.uploadSpeed.toFixed(1)} Mbps\nPing: ${results.ping.toFixed(0)} ms`;
    navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full bg-[#0f172a] rounded-[2rem] p-8 border border-white/5 relative overflow-hidden">
        {/* Glow behind grade */}
        <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20 rounded-full pointer-events-none" style={{ backgroundColor: grade.color }}></div>

        <div className="flex flex-col md:flex-row gap-12 items-center">
            
            {/* Left: Grade Badge */}
            <div className="flex-shrink-0 text-center md:text-left">
                <div className="inline-flex items-center justify-center w-40 h-40 rounded-full border-8 shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)] bg-[#020617] relative mb-6" style={{ borderColor: grade.color }}>
                    <span className="text-6xl font-black text-white">{grade.grade}</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{grade.label}</h2>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Monitor size={14} />
                        {grade.streaming}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Gamepad2 size={14} />
                        {grade.gaming}
                    </div>
                </div>
            </div>

            {/* Right: Detailed Grid */}
            <div className="flex-grow w-full">
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex flex-col justify-center">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-500 text-xs font-bold uppercase">Download</span>
                            <Download size={16} className="text-cyan-400" />
                         </div>
                         <div className="text-3xl font-bold text-white">{results.downloadSpeed.toFixed(1)}</div>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex flex-col justify-center">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-500 text-xs font-bold uppercase">Upload</span>
                            <Upload size={16} className="text-indigo-400" />
                         </div>
                         <div className="text-3xl font-bold text-white">{results.uploadSpeed.toFixed(1)}</div>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex flex-col justify-center">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-500 text-xs font-bold uppercase">Ping</span>
                            <Activity size={16} className="text-emerald-400" />
                         </div>
                         <div className="text-3xl font-bold text-white">{results.ping.toFixed(0)} <span className="text-sm text-slate-500">ms</span></div>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex flex-col justify-center">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-500 text-xs font-bold uppercase">Jitter</span>
                            <Wifi size={16} className="text-amber-400" />
                         </div>
                         <div className="text-3xl font-bold text-white">{results.jitter.toFixed(0)} <span className="text-sm text-slate-500">ms</span></div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={onRestart} className="flex-1 bg-white text-slate-900 font-bold py-4 rounded-xl hover:bg-cyan-50 transition-colors flex items-center justify-center gap-2">
                        <RefreshCw size={20} /> Test Again
                    </button>
                    <button onClick={handleShare} className="flex-1 bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                        {copied ? <Check size={20} className="text-green-400"/> : <Share2 size={20} />}
                        {copied ? "Copied" : "Share"}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};