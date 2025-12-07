import React, { useState } from 'react';
import { PageRoute } from '../types';
import { Home, Server, Router, AlertCircle, CheckCircle, XCircle, Play } from 'lucide-react';

interface PortTesterPageProps {
  onNavigate: (page: PageRoute) => void;
}

const COMMON_PORTS = [
    { port: 80, name: 'HTTP', desc: 'Web Traffic' },
    { port: 443, name: 'HTTPS', desc: 'Secure Web' },
    { port: 8080, name: 'HTTP-Alt', desc: 'Proxy/Web' },
    { port: 8443, name: 'HTTPS-Alt', desc: 'Secure Alt' },
];

export const PortTesterPage: React.FC<PortTesterPageProps> = ({ onNavigate }) => {
  const [host, setHost] = useState('example.com');
  const [results, setResults] = useState<Record<number, 'open' | 'closed' | 'testing'>>({});

  const checkPort = async (port: number) => {
    setResults(p => ({ ...p, [port]: 'testing' }));
    
    // Testing logic using Fetch + Timeout
    // Note: Browser sandboxing limits true port scanning. 
    // We check if we can get ANY response (even CORS error or 404) vs a Connection Refused.
    
    const start = performance.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000); // 2s timeout means likely closed/filtered

    try {
        const protocol = port === 443 || port === 8443 ? 'https' : 'http';
        await fetch(`${protocol}://${host}:${port}`, {
            mode: 'no-cors', // Opaque request
            signal: controller.signal
        });
        // If we get here (even with opacity), the port accepted the TCP connection
        setResults(p => ({ ...p, [port]: 'open' }));
    } catch (e) {
        // Fetch error. If it's an AbortError, it timed out (Filtered). 
        // If it's a TypeError (Network Error), the TCP connection was refused (Closed) immediately.
        if (e instanceof DOMException && e.name === 'AbortError') {
             // Timed out = Filtered/Open but slow? Treat as closed for simplicity in browser
             setResults(p => ({ ...p, [port]: 'closed' }));
        } else {
             // Connection Refused
             setResults(p => ({ ...p, [port]: 'closed' }));
        }
    } finally {
        clearTimeout(timeout);
    }
  };

  const scanAll = () => {
    COMMON_PORTS.forEach(p => checkPort(p.port));
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-red-500/30">
      
      <nav className="border-b border-white/5 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer focus:outline-none">
            <Home className="text-slate-400 hover:text-white transition-colors" size={20} />
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            <Router className="text-red-400" size={24} />
            <span className="text-lg font-bold tracking-tight text-white">Port Tester</span>
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        
        <div className="flex flex-col items-center justify-center mb-12 text-center animate-fade-in">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Server size={12} />
                Availability Check
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
               Port Availability Tester
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
                Check if common web ports are open and accessible on a target server.
                <br/><span className="text-xs opacity-50">* Browser-based scan. Accuracy limited by CORS/Firewalls.</span>
            </p>
        </div>

        <div className="bg-[#0f172a] rounded-[2rem] p-8 border border-white/5 shadow-2xl mb-8">
            <div className="flex gap-4 mb-8">
                <input 
                    type="text" 
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    className="flex-grow bg-[#020617] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                />
                <button 
                    onClick={scanAll}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-xl transition-all active:scale-95 flex items-center gap-2"
                >
                    <Play size={20} /> Scan
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {COMMON_PORTS.map((p) => (
                    <div key={p.port} className="bg-[#020617] p-5 rounded-xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 font-mono font-bold">
                                {p.port}
                            </div>
                            <div>
                                <div className="text-white font-bold">{p.name}</div>
                                <div className="text-slate-500 text-xs">{p.desc}</div>
                            </div>
                        </div>
                        
                        <div>
                            {results[p.port] === 'testing' && <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>}
                            {results[p.port] === 'open' && (
                                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 py-1 rounded-full">
                                    <CheckCircle size={14}/> OPEN
                                </div>
                            )}
                            {results[p.port] === 'closed' && (
                                <div className="flex items-center gap-2 text-red-400 font-bold text-sm bg-red-500/10 px-3 py-1 rounded-full">
                                    <XCircle size={14}/> CLOSED
                                </div>
                            )}
                            {!results[p.port] && <span className="text-slate-600 text-sm">-</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </main>
    </div>
  );
};