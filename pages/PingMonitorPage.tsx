
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PageRoute } from '../types';
import { Home, Activity, Play, Square, Settings, RefreshCw, Server, Wifi, Gamepad2, AlertTriangle, Zap } from 'lucide-react';

interface PingMonitorPageProps {
  onNavigate: (page: PageRoute) => void;
}

interface PingData {
  id: number;
  timestamp: number;
  latency: number; // ms, -1 for timeout/error
}

const TARGET_ENDPOINTS = [
    { name: 'Cloudflare Edge', url: 'https://1.1.1.1/cdn-cgi/trace', desc: 'Global DNS Provider' },
    { name: 'Google Cloud', url: 'https://speed.cloudflare.com/__down?bytes=0', desc: 'High availability CDN' } // Using CF as proxy for stability in browser
];

export const PingMonitorPage: React.FC<PingMonitorPageProps> = ({ onNavigate }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [targetIndex, setTargetIndex] = useState(0);
  const [intervalMs, setIntervalMs] = useState(1000);
  const [history, setHistory] = useState<PingData[]>([]);
  
  // Stats
  const [stats, setStats] = useState({
    min: 0,
    max: 0,
    avg: 0,
    jitter: 0,
    loss: 0,
    count: 0
  });

  const timerRef = useRef<number | null>(null);
  const reqIdRef = useRef(0);

  // Live Chart SVG Logic
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Calculate stats on every history update
  useEffect(() => {
    if (history.length === 0) {
        setStats({ min: 0, max: 0, avg: 0, jitter: 0, loss: 0, count: 0 });
        return;
    }

    const successfulPings = history.filter(p => p.latency !== -1).map(p => p.latency);
    const failedCount = history.filter(p => p.latency === -1).length;
    
    if (successfulPings.length === 0) {
        setStats(prev => ({ ...prev, loss: 100, count: history.length }));
        return;
    }

    const min = Math.min(...successfulPings);
    const max = Math.max(...successfulPings);
    const avg = successfulPings.reduce((a, b) => a + b, 0) / successfulPings.length;
    
    // Jitter: Standard Deviation
    const variance = successfulPings.reduce((t, n) => t + Math.pow(n - avg, 2), 0) / successfulPings.length;
    const jitter = Math.sqrt(variance);

    const loss = (failedCount / history.length) * 100;

    setStats({
        min, max, avg, jitter, loss, count: history.length
    });

  }, [history]);

  const doPing = async () => {
    const id = reqIdRef.current++;
    const start = performance.now();
    const endpoint = TARGET_ENDPOINTS[targetIndex].url;

    try {
        // Add cache buster to prevent cached results (0ms ping)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

        await fetch(`${endpoint}&t=${Date.now()}`, {
            method: 'HEAD',
            cache: 'no-store',
            signal: controller.signal,
            mode: 'no-cors' // Opaque request, but performance.now captures RTT
        });
        
        clearTimeout(timeoutId);
        const end = performance.now();
        const latency = end - start;

        setHistory(prev => {
            const next = [...prev, { id, timestamp: Date.now(), latency }];
            return next.slice(-60); // Keep last 60 points
        });

    } catch (e) {
        setHistory(prev => {
            const next = [...prev, { id, timestamp: Date.now(), latency: -1 }];
            return next.slice(-60);
        });
    }
  };

  useEffect(() => {
    if (isRunning) {
        // Run immediately
        doPing();
        // Then interval
        timerRef.current = window.setInterval(doPing, intervalMs);
    } else {
        if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, targetIndex, intervalMs]);

  const handleClear = () => {
    setHistory([]);
    reqIdRef.current = 0;
  };

  // Render SVG Chart
  const chartPath = useMemo(() => {
    if (history.length < 2) return "";
    
    const width = 800;
    const height = 200;
    const maxLat = Math.max(100, ...history.map(p => p.latency)) * 1.1; // Dynamic Y scale, min 100ms
    
    const points = history.map((p, i) => {
        // X is equally spaced
        const x = (i / (history.length - 1 || 1)) * width;
        // Y is latency (invert because SVG 0 is top)
        // If error (-1), draw at top (height) or skip? Let's draw at max height (0) to show spike
        const y = p.latency === -1 ? 0 : height - (p.latency / maxLat) * height;
        return `${x},${y}`;
    }).join(" ");

    return points;
  }, [history]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-amber-500/30">
      
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer focus:outline-none">
            <Home className="text-slate-400 hover:text-white transition-colors" size={20} />
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            <Activity className="text-amber-400 fill-amber-400/20" size={24} />
            <span className="text-lg font-bold tracking-tight text-white">Ping Monitor</span>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
            {/* Control Panel */}
            <div className="md:col-span-4 bg-[#0f172a] rounded-2xl p-6 border border-white/5 flex flex-col gap-6">
                
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Target Server</label>
                    <div className="flex flex-col gap-2">
                        {TARGET_ENDPOINTS.map((t, i) => (
                            <button 
                                key={i}
                                onClick={() => !isRunning && setTargetIndex(i)}
                                disabled={isRunning}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left
                                    ${targetIndex === i 
                                        ? 'bg-amber-500/10 border-amber-500/50 text-white' 
                                        : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800'
                                    } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <Server size={18} className={targetIndex === i ? 'text-amber-400' : 'text-slate-500'} />
                                <div>
                                    <div className="font-bold text-sm">{t.name}</div>
                                    <div className="text-xs opacity-70">{t.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                        Ping Interval: <span className="text-white">{intervalMs}ms</span>
                    </label>
                    <input 
                        type="range" min="200" max="2000" step="100" 
                        value={intervalMs}
                        onChange={(e) => setIntervalMs(parseInt(e.target.value))}
                        disabled={isRunning}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer disabled:opacity-50 accent-amber-500"
                    />
                </div>

                <div className="flex gap-3 mt-auto">
                    <button 
                        onClick={() => setIsRunning(!isRunning)}
                        className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                            ${isRunning 
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                                : 'bg-amber-500 text-slate-900 hover:bg-amber-400'
                            }`}
                    >
                        {isRunning ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        {isRunning ? 'STOP' : 'START'}
                    </button>
                    <button 
                        onClick={handleClear}
                        className="px-4 bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-700 transition-colors"
                        title="Clear History"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>

            {/* Live Graph */}
            <div className="md:col-span-8 bg-[#0f172a] rounded-2xl p-6 border border-white/5 relative overflow-hidden flex flex-col">
                 <div className="flex items-center justify-between mb-4 relative z-10">
                     <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Activity className="text-amber-400" />
                        Live Latency
                     </h2>
                     <div className="flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" style={{ opacity: isRunning ? 1 : 0 }}></span>
                         <span className="text-xs font-mono text-slate-400">{isRunning ? 'LIVE' : 'PAUSED'}</span>
                     </div>
                 </div>

                 <div className="flex-grow bg-[#020617] rounded-xl border border-white/5 relative overflow-hidden h-[300px]">
                     {/* Grid Lines */}
                     <div className="absolute inset-0 grid grid-rows-4 w-full h-full">
                        <div className="border-b border-white/5"></div>
                        <div className="border-b border-white/5"></div>
                        <div className="border-b border-white/5"></div>
                     </div>

                     {history.length > 1 ? (
                        <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="w-full h-full absolute inset-0">
                            <defs>
                                <linearGradient id="grad-ping" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path 
                                d={`M 0,200 ${chartPath} L 800,200 Z`} 
                                fill="url(#grad-ping)" 
                            />
                            <polyline 
                                points={chartPath} 
                                fill="none" 
                                stroke="#f59e0b" 
                                strokeWidth="2" 
                                vectorEffect="non-scaling-stroke"
                            />
                        </svg>
                     ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-700 text-sm font-mono">
                            Press START to visualize data
                        </div>
                     )}
                 </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
             <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                <div className="text-slate-500 text-xs font-bold uppercase mb-1">Current</div>
                <div className="text-3xl font-mono font-bold text-white">
                    {history.length > 0 && history[history.length - 1].latency !== -1 
                        ? history[history.length - 1].latency.toFixed(0) 
                        : '--'}
                    <span className="text-sm font-sans text-slate-500 ml-1">ms</span>
                </div>
             </div>
             
             <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                <div className="text-slate-500 text-xs font-bold uppercase mb-1">Average</div>
                <div className="text-3xl font-mono font-bold text-white">
                    {stats.avg.toFixed(0)}
                    <span className="text-sm font-sans text-slate-500 ml-1">ms</span>
                </div>
             </div>

             <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                <div className="text-slate-500 text-xs font-bold uppercase mb-1">Jitter (Stability)</div>
                <div className={`text-3xl font-mono font-bold ${stats.jitter > 30 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {stats.jitter.toFixed(1)}
                    <span className="text-sm font-sans text-slate-500 ml-1">ms</span>
                </div>
             </div>

             <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                <div className="text-slate-500 text-xs font-bold uppercase mb-1">Packet Loss</div>
                <div className={`text-3xl font-mono font-bold ${stats.loss > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {stats.loss.toFixed(1)}%
                </div>
             </div>
        </div>
        
        {/* SEO Rich Content Section */}
        <section className="mt-12 border-t border-white/5 pt-12 text-slate-400 space-y-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Why Monitor Your Ping & Jitter?</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-amber-400">
                        <Gamepad2 size={20} />
                        <h3 className="font-bold text-white">Optimize Gaming Performance</h3>
                    </div>
                    <p className="text-sm leading-relaxed">
                        In competitive gaming (FPS, MOBA, Battle Royale), low latency is critical. High ping results in delayed actions. This tool helps you diagnose if lag is caused by your local network or the game server. Ideally, you want a ping under 50ms and 0% packet loss.
                    </p>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2 text-amber-400">
                        <AlertTriangle size={20} />
                        <h3 className="font-bold text-white">Diagnose Packet Loss</h3>
                    </div>
                    <p className="text-sm leading-relaxed">
                        Packet loss occurs when data units fail to reach their destination. This results in "rubber banding" in games or choppy video calls. Our monitor detects failed requests instantly, allowing you to troubleshoot faulty cables or Wi-Fi interference.
                    </p>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2 text-amber-400">
                        <Zap size={20} />
                        <h3 className="font-bold text-white">Check Jitter Stability</h3>
                    </div>
                    <p className="text-sm leading-relaxed">
                        Jitter measures the variance in your response times. A connection with 20ms ping that spikes to 200ms every few seconds (High Jitter) is worse than a stable 80ms connection. Consistent jitter is key for smooth VoIP calls and streaming.
                    </p>
                </div>
            </div>
            
            <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5 text-sm">
                <h4 className="font-bold text-white mb-2">How this tool works</h4>
                <p>
                    This is a browser-based <strong>Ping Test</strong>. Since browsers cannot send raw ICMP packets (the traditional "ping" command), this tool uses high-frequency HTTP Head requests to global edge servers (Cloudflare). This effectively measures "Application Layer Latency," which is the real-world responsiveness you experience when browsing websites or using web apps.
                </p>
            </div>
        </section>

      </main>
    </div>
  );
};