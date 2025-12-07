import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { Home, HardDrive, Clock, ArrowRight, DownloadCloud, FileBox } from 'lucide-react';

interface FileTransferPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const FileTransferPage: React.FC<FileTransferPageProps> = ({ onNavigate }) => {
  const [fileSize, setFileSize] = useState(10);
  const [fileUnit, setFileUnit] = useState<'MB' | 'GB' | 'TB'>('GB');
  const [speed, setSpeed] = useState(100);
  const [speedUnit, setSpeedUnit] = useState<'Mbps' | 'Gbps'>('Mbps');
  const [time, setTime] = useState('');

  useEffect(() => {
    // Convert everything to Megabits
    let sizeInMb = fileSize;
    if (fileUnit === 'GB') sizeInMb *= 1024;
    if (fileUnit === 'TB') sizeInMb *= 1024 * 1024;
    sizeInMb *= 8; // Bytes to bits

    let speedInMbps = speed;
    if (speedUnit === 'Gbps') speedInMbps *= 1000;

    if (speedInMbps <= 0 || sizeInMb <= 0) {
        setTime('--');
        return;
    }

    const seconds = sizeInMb / speedInMbps;

    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);

    setTime(parts.join(' ') || '0s');

  }, [fileSize, fileUnit, speed, speedUnit]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-teal-500/30">
      
      <nav className="border-b border-white/5 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer focus:outline-none">
            <Home className="text-slate-400 hover:text-white transition-colors" size={20} />
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            <Clock className="text-teal-400" size={24} />
            <span className="text-lg font-bold tracking-tight text-white">Transfer Calc</span>
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        
        <div className="flex flex-col items-center justify-center mb-12 text-center animate-fade-in">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider mb-6">
                <DownloadCloud size={12} />
                Time Estimator
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
               File Transfer Calculator
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
                Calculate exactly how long it will take to upload or download files based on your internet bandwidth.
            </p>
        </div>

        <div className="bg-[#0f172a] rounded-[2rem] p-8 border border-white/5 shadow-2xl mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
                
                <div className="space-y-8">
                    {/* File Size Input */}
                    <div>
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-2">
                            <HardDrive size={16} /> File Size
                        </label>
                        <div className="flex">
                            <input 
                                type="number" 
                                value={fileSize}
                                onChange={(e) => setFileSize(parseFloat(e.target.value) || 0)}
                                className="w-full bg-[#020617] border border-white/10 rounded-l-xl px-4 py-4 text-white font-mono text-xl focus:outline-none focus:border-teal-500/50 transition-colors"
                            />
                            <select 
                                value={fileUnit}
                                onChange={(e) => setFileUnit(e.target.value as any)}
                                className="bg-slate-800 border-y border-r border-white/10 rounded-r-xl px-4 text-white font-bold focus:outline-none"
                            >
                                <option value="MB">MB</option>
                                <option value="GB">GB</option>
                                <option value="TB">TB</option>
                            </select>
                        </div>
                    </div>

                    {/* Speed Input */}
                    <div>
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-2">
                            <DownloadCloud size={16} /> Internet Speed
                        </label>
                        <div className="flex">
                            <input 
                                type="number" 
                                value={speed}
                                onChange={(e) => setSpeed(parseFloat(e.target.value) || 0)}
                                className="w-full bg-[#020617] border border-white/10 rounded-l-xl px-4 py-4 text-white font-mono text-xl focus:outline-none focus:border-teal-500/50 transition-colors"
                            />
                            <select 
                                value={speedUnit}
                                onChange={(e) => setSpeedUnit(e.target.value as any)}
                                className="bg-slate-800 border-y border-r border-white/10 rounded-r-xl px-4 text-white font-bold focus:outline-none"
                            >
                                <option value="Mbps">Mbps</option>
                                <option value="Gbps">Gbps</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Result */}
                <div className="bg-[#020617]/50 rounded-2xl p-8 border border-white/5 flex flex-col items-center justify-center text-center relative z-10 h-full">
                    <div className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-4">Estimated Time</div>
                    <div className="text-4xl md:text-5xl font-black text-white font-mono tracking-tight text-teal-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.3)]">
                        {time}
                    </div>
                </div>
            </div>
        </div>

        {/* SEO Content */}
        <section className="border-t border-white/5 pt-12 text-slate-400 space-y-8 max-w-4xl mx-auto">
             <h2 className="text-2xl font-bold text-white mb-4">Transfer Time Formula</h2>
             <div className="grid md:grid-cols-2 gap-8">
                <div>
                     <h3 className="font-bold text-white mb-2 flex items-center gap-2"><FileBox size={18} className="text-teal-400"/> Bits vs Bytes</h3>
                     <p className="text-sm">
                        Internet speed is measured in <strong>bits</strong> (Mbps), while file sizes are measured in <strong>bytes</strong> (MB). 1 Byte = 8 bits. This calculator handles the conversion automatically.
                     </p>
                </div>
                <div>
                     <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Clock size={18} className="text-teal-400"/> Real World Speed</h3>
                     <p className="text-sm">
                        Theoretical speed is rarely achieved. Network overhead usually reduces actual transfer speeds by about 5-10%.
                     </p>
                </div>
             </div>
        </section>

      </main>
    </div>
  );
};