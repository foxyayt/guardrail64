import React, { useState, useEffect, useRef } from 'react';
import { Gauge } from '../components/Gauge';
import { ResultCard } from '../components/ResultCard';
import { SpeedTestEngine } from '../services/speedTest';
import { TestState, SpeedPoint, SpeedTestResult, NetworkGrade, PageRoute } from '../types';
import { Zap, Radio, Play, Activity, ArrowDown, ArrowUp, Home } from 'lucide-react';

// Custom SVG Chart Component
const SpeedChart = ({ data, maxSpeed, color }: { data: SpeedPoint[], maxSpeed: number, color: string }) => {
    if (!data || data.length < 2) return null;
    
    const width = 100;
    const height = 40; 
    
    const minTime = data[0].time;
    const maxTime = data[data.length - 1].time;
    const timeRange = maxTime - minTime || 1;
    const safeMaxSpeed = maxSpeed || 1;
    
    const points = data.map((p) => {
        const x = ((p.time - minTime) / timeRange) * width;
        const y = height - (p.speed / safeMaxSpeed) * height;
        return `${x},${y}`;
    }).join(' ');

    const fillPath = `M 0,${height} ${points} L ${width},${height} Z`;
    
    return (
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full opacity-30">
            <defs>
                <linearGradient id={`grad-${color}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={fillPath} fill={`url(#grad-${color})`} stroke="none" />
            <polyline points={points} fill="none" stroke={color} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
    );
};

interface SpeedTestPageProps {
    onNavigate: (page: PageRoute) => void;
}

export const SpeedTestPage: React.FC<SpeedTestPageProps> = ({ onNavigate }) => {
  const [testState, setTestState] = useState<TestState>(TestState.IDLE);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [chartData, setChartData] = useState<SpeedPoint[]>([]);
  
  const [maxChartValue, setMaxChartValue] = useState(100);

  const [results, setResults] = useState<SpeedTestResult>({
    downloadSpeed: 0,
    uploadSpeed: 0,
    ping: 0,
    jitter: 0,
    timestamp: 0
  });
  
  const [serverInfo, setServerInfo] = useState({ name: "Cloudflare Edge", location: "Global" });
  const engineRef = useRef<SpeedTestEngine | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setServerInfo(prev => ({ ...prev, location: timeZone }));
    } catch (e) { /* ignore */ }

    // Cleanup on unmount
    return () => {
        if (engineRef.current) {
            engineRef.current.abort();
        }
    };
  }, []);

  useEffect(() => {
    if (testState === TestState.COMPLETE && resultRef.current) {
        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  }, [testState]);

  const calculateGrade = (result: SpeedTestResult): NetworkGrade => {
    const { downloadSpeed, ping } = result;
    if (downloadSpeed > 300 && ping < 20) return { grade: "A+", color: "#10b981", label: "Elite", streaming: "8K HDR", gaming: "Pro Level" };
    if (downloadSpeed > 100 && ping < 40) return { grade: "A", color: "#22d3ee", label: "Excellent", streaming: "4K UHD", gaming: "Great" };
    if (downloadSpeed > 50 && ping < 60) return { grade: "B", color: "#818cf8", label: "Good", streaming: "4K/1080p", gaming: "Casual" };
    if (downloadSpeed > 25) return { grade: "C", color: "#f59e0b", label: "Average", streaming: "1080p", gaming: "Playable" };
    return { grade: "D", color: "#ef4444", label: "Basic", streaming: "720p", gaming: "Laggy" };
  };

  const startTest = async () => {
    setTestState(TestState.PING);
    setChartData([]);
    setProgress(0);
    setCurrentSpeed(0);
    setMaxChartValue(100);
    setResults({ downloadSpeed: 0, uploadSpeed: 0, ping: 0, jitter: 0, timestamp: 0 });

    engineRef.current = new SpeedTestEngine((speed, prog, points) => {
      setCurrentSpeed(speed);
      setProgress(prog);
      
      if (speed > maxChartValue) setMaxChartValue(speed * 1.2);

      if (points.length > 0) {
         setChartData([...points]);
      }
    });

    try {
      const { ping, jitter } = await engineRef.current.measurePing();
      setResults(prev => ({ ...prev, ping, jitter }));
      
      setTestState(TestState.DOWNLOAD);
      setChartData([]); 
      const downloadSpeed = await engineRef.current.measureDownload();
      setResults(prev => ({ ...prev, downloadSpeed }));

      setTestState(TestState.UPLOAD);
      setChartData([]); 
      setCurrentSpeed(0); 
      const uploadSpeed = await engineRef.current.measureUpload();
      setResults(prev => ({ ...prev, uploadSpeed, timestamp: Date.now() }));

      setTestState(TestState.COMPLETE);
      
    } catch (error) {
      // Don't log abort errors
      if (error instanceof Error && error.message === 'Aborted') return;
      
      console.error(error);
      setTestState(TestState.ERROR);
    }
  };

  const getStatusText = () => {
    switch(testState) {
        case TestState.IDLE: return "READY TO TEST";
        case TestState.PING: return "MEASURING LATENCY...";
        case TestState.DOWNLOAD: return "TESTING DOWNLOAD...";
        case TestState.UPLOAD: return "TESTING UPLOAD...";
        case TestState.COMPLETE: return "TEST COMPLETE";
        case TestState.ERROR: return "CONNECTION ERROR";
        default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30">
      
      <nav className="border-b border-white/5 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer focus:outline-none">
            <Home className="text-slate-400 hover:text-white transition-colors" size={20} />
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            <Zap className="text-cyan-400 fill-cyan-400" size={24} />
            <span className="text-lg font-bold tracking-tight text-white">Internet Speed Test</span>
          </button>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                <Radio size={12} className={testState !== TestState.IDLE && testState !== TestState.COMPLETE ? "text-green-500 animate-pulse" : ""} />
                {serverInfo.name} <span className="hidden sm:inline opacity-50">({serverInfo.location})</span>
             </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12 flex flex-col items-center">
        
        <div className="w-full bg-[#0f172a] rounded-[2.5rem] p-2 shadow-2xl border border-white/5 relative overflow-hidden">
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-50 transition-all duration-1000
                ${testState === TestState.UPLOAD ? 'from-purple-500/10' : ''}
                ${testState === TestState.PING ? 'from-emerald-500/10' : ''}
            `}></div>

            <div className="relative bg-[#020617] rounded-[2rem] p-6 md:p-12 border border-white/5">
                
                <div className="flex flex-col items-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
                        {testState === TestState.IDLE ? "CHECK YOUR SPEED" : getStatusText()}
                    </h1>
                    <div className="h-1 w-24 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-cyan-400 transition-all duration-300 ease-out"
                            style={{ width: `${testState === TestState.IDLE ? 0 : progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
                    
                    <div className="md:col-span-3 flex flex-row md:flex-col gap-4">
                        <div className={`flex-1 bg-slate-900/50 rounded-2xl p-5 border transition-all duration-500 
                            ${testState === TestState.PING ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-white/5'}`}>
                            <div className="flex items-center gap-2 mb-2 text-slate-400">
                                <Activity size={16} className={testState === TestState.PING ? "text-emerald-400" : ""} />
                                <span className="text-xs font-bold uppercase tracking-wider">Ping</span>
                            </div>
                            <div className="text-3xl font-mono font-bold text-white">
                                {results.ping > 0 ? results.ping.toFixed(0) : '--'} 
                                <span className="text-sm font-sans font-normal text-slate-500 ml-1">ms</span>
                            </div>
                        </div>
                        <div className={`flex-1 bg-slate-900/50 rounded-2xl p-5 border transition-all duration-500 
                            ${testState === TestState.PING ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-white/5'}`}>
                            <div className="flex items-center gap-2 mb-2 text-slate-400">
                                <Activity size={16} className={testState === TestState.PING ? "text-emerald-400" : ""} />
                                <span className="text-xs font-bold uppercase tracking-wider">Jitter</span>
                            </div>
                            <div className="text-3xl font-mono font-bold text-white">
                                {results.jitter > 0 ? results.jitter.toFixed(0) : '--'}
                                <span className="text-sm font-sans font-normal text-slate-500 ml-1">ms</span>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-6 relative h-[300px] flex items-center justify-center">
                        {testState === TestState.IDLE ? (
                             <button 
                                onClick={startTest}
                                className="group relative w-48 h-48 rounded-full flex items-center justify-center transition-transform active:scale-95"
                            >
                                <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-pulse"></div>
                                <div className="absolute inset-2 border-2 border-cyan-500/50 rounded-full"></div>
                                <div className="absolute inset-0 rounded-full border border-cyan-500/30 scale-125 opacity-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500"></div>
                                <div className="z-10 flex flex-col items-center">
                                    <Play size={48} className="text-white fill-white ml-2 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-bold text-cyan-200 tracking-widest">START</span>
                                </div>
                            </button>
                        ) : (
                            <div className="w-full h-full relative">
                                <Gauge 
                                    value={currentSpeed} 
                                    max={maxChartValue} 
                                    label={testState === TestState.DOWNLOAD ? 'DOWNLOAD' : testState === TestState.UPLOAD ? 'UPLOAD' : 'PING'} 
                                    color={testState === TestState.UPLOAD ? '#818cf8' : '#22d3ee'}
                                />
                                {/* Background SVG Chart */}
                                <div className="absolute inset-0 flex items-end justify-center pointer-events-none pb-8 px-8">
                                    <SpeedChart 
                                        data={chartData} 
                                        maxSpeed={maxChartValue} 
                                        color={testState === TestState.UPLOAD ? '#818cf8' : '#22d3ee'} 
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-3 flex flex-row md:flex-col gap-4">
                        <div className={`flex-1 bg-slate-900/50 rounded-2xl p-5 border transition-all duration-500 
                            ${testState === TestState.DOWNLOAD ? 'border-cyan-400 bg-cyan-900/10 shadow-[0_0_30px_-10px_rgba(34,211,238,0.3)]' : 'border-white/5'}`}>
                            <div className="flex items-center gap-2 mb-2 text-slate-400">
                                <ArrowDown size={16} className={testState === TestState.DOWNLOAD ? "text-cyan-400" : ""} />
                                <span className="text-xs font-bold uppercase tracking-wider">Download</span>
                            </div>
                            <div className="text-3xl font-mono font-bold text-white">
                                {results.downloadSpeed > 0 ? results.downloadSpeed.toFixed(1) : '--'}
                                <span className="text-sm font-sans font-normal text-slate-500 ml-1">Mbps</span>
                            </div>
                        </div>
                        <div className={`flex-1 bg-slate-900/50 rounded-2xl p-5 border transition-all duration-500 
                            ${testState === TestState.UPLOAD ? 'border-indigo-400 bg-indigo-900/10 shadow-[0_0_30px_-10px_rgba(129,140,248,0.3)]' : 'border-white/5'}`}>
                            <div className="flex items-center gap-2 mb-2 text-slate-400">
                                <ArrowUp size={16} className={testState === TestState.UPLOAD ? "text-indigo-400" : ""} />
                                <span className="text-xs font-bold uppercase tracking-wider">Upload</span>
                            </div>
                            <div className="text-3xl font-mono font-bold text-white">
                                {results.uploadSpeed > 0 ? results.uploadSpeed.toFixed(1) : '--'}
                                <span className="text-sm font-sans font-normal text-slate-500 ml-1">Mbps</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="text-center">
                    <p className="text-xs text-slate-600">
                        * If upload speed is 0, your network or browser sandbox may be blocking outgoing traffic. <br/> 
                        Deploy to a live domain for full accuracy.
                    </p>
                </div>

            </div>
        </div>

        {testState === TestState.COMPLETE && (
             <div ref={resultRef} className="w-full mt-8 animate-fade-in">
                 <ResultCard 
                    results={results}
                    grade={calculateGrade(results)}
                    onRestart={startTest}
                 />
             </div>
        )}
        
        <section className="mt-20 max-w-4xl w-full text-slate-400 leading-relaxed space-y-8">
            <h2 className="text-2xl font-bold text-white">Understanding Your Internet Speed</h2>
            <p>
                In today's digital age, having a reliable internet connection is crucial. Our <strong>Guardrail64 Speed Test</strong> tool provides a precise analysis of your network performance, measuring latency (ping), jitter, download speed, and upload speed directly from your browser.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-bold text-cyan-400 mb-2">Download Speed</h3>
                    <p className="text-sm">
                        Download speed determines how fast information is transferred from the internet to your device. This affects how quickly you can load websites, stream movies on Netflix or YouTube, and download large files. A speed of 25 Mbps is generally considered good for 4K streaming.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-indigo-400 mb-2">Upload Speed</h3>
                    <p className="text-sm">
                        Upload speed is how fast data travels from your device to the internet. This is vital for video conferencing (Zoom, Teams), online gaming, and backing up files to the cloud. A symmetric connection (equal upload/download) is ideal for content creators.
                    </p>
                </div>
            </div>

            <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5">
                <h3 className="text-lg font-bold text-white mb-4">What do the grades mean?</h3>
                <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3"><span className="text-emerald-400 font-bold w-8">A+</span> <span>Elite performance. Perfect for 8K streaming, pro-gaming, and heavy workloads.</span></li>
                    <li className="flex items-center gap-3"><span className="text-cyan-400 font-bold w-8">A</span> <span>Excellent. Handles 4K streams and multiple devices easily.</span></li>
                    <li className="flex items-center gap-3"><span className="text-indigo-400 font-bold w-8">B</span> <span>Good. Reliable for HD streaming and standard work from home tasks.</span></li>
                    <li className="flex items-center gap-3"><span className="text-amber-400 font-bold w-8">C</span> <span>Average. Sufficient for browsing and 1080p video, but may buffer with multiple users.</span></li>
                </ul>
            </div>
        </section>

      </main>
    </div>
  );
};