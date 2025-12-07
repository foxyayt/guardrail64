import React, { useState } from 'react';
import { PageRoute } from '../types';
import { Home, Cpu, Search, Tag, Building2, AlertTriangle, Delete, Database, Wifi } from 'lucide-react';

interface MacLookupPageProps {
  onNavigate: (page: PageRoute) => void;
}

// Top 50 Common Vendors to bypass API calls for most common tests
const COMMON_VENDORS: Record<string, string> = {
    '00:00:0C': 'Cisco Systems',
    '00:01:42': 'Cisco Systems',
    '00:01:63': 'Cisco Systems',
    '00:01:64': 'Cisco Systems',
    '00:01:96': 'Cisco Systems',
    '00:01:97': 'Cisco Systems',
    '00:05:9A': 'Cisco Systems',
    '00:03:93': 'Apple, Inc.',
    '00:05:02': 'Apple, Inc.',
    '00:0A:27': 'Apple, Inc.',
    '00:0A:95': 'Apple, Inc.',
    '00:0D:93': 'Apple, Inc.',
    '00:10:FA': 'Apple, Inc.',
    '00:11:24': 'Apple, Inc.',
    '00:14:51': 'Apple, Inc.',
    '00:16:CB': 'Apple, Inc.',
    '00:17:F2': 'Apple, Inc.',
    '00:19:E3': 'Apple, Inc.',
    '00:1B:63': 'Apple, Inc.',
    '00:1C:B3': 'Apple, Inc.',
    '00:1D:4F': 'Apple, Inc.',
    '00:1E:52': 'Apple, Inc.',
    '00:1F:5B': 'Apple, Inc.',
    '00:1F:F3': 'Apple, Inc.',
    '00:21:E9': 'Apple, Inc.',
    '00:22:41': 'Apple, Inc.',
    '00:23:12': 'Apple, Inc.',
    '00:23:32': 'Apple, Inc.',
    '00:23:6C': 'Apple, Inc.',
    '00:23:DF': 'Apple, Inc.',
    '00:24:36': 'Apple, Inc.',
    '00:25:00': 'Apple, Inc.',
    '00:25:4B': 'Apple, Inc.',
    '00:25:BC': 'Apple, Inc.',
    '00:26:08': 'Apple, Inc.',
    '00:26:4A': 'Apple, Inc.',
    '00:26:BB': 'Apple, Inc.',
    '00:00:5E': 'ICANN (IANA)',
    '00:50:56': 'VMware, Inc.',
    '00:0C:29': 'VMware, Inc.',
    '00:05:69': 'VMware, Inc.',
    '00:15:5D': 'Microsoft Corporation',
    '00:03:FF': 'Microsoft Corporation',
    '00:0D:3A': 'Microsoft Corporation',
    '00:12:5A': 'Microsoft Corporation',
    '00:17:FA': 'Microsoft Corporation',
    '00:50:F2': 'Microsoft Corporation',
    '00:1A:11': 'Google, Inc.',
    '3C:5A:B4': 'Google, Inc.',
    '00:16:3E': 'Xensource, Inc.',
    '08:00:27': 'Cadmus Computer Systems (VirtualBox)',
    '52:54:00': 'Realtek / QEMU Virtual NIC',
};

export const MacLookupPage: React.FC<MacLookupPageProps> = ({ onNavigate }) => {
  const [mac, setMac] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [source, setSource] = useState<'Local' | 'API'>('Local');

  const cleanInput = (input: string) => {
    return input.replace(/[^a-fA-F0-9]/g, '').toUpperCase();
  };

  const formatMac = (clean: string) => {
    if (clean.length > 0) {
        const parts = clean.match(/.{1,2}/g);
        return parts ? parts.join(':') : clean;
    }
    return '';
  };

  const lookup = async () => {
    const clean = cleanInput(mac);
    
    if (clean.length < 6) {
        setError('Please enter at least 6 hex characters (OUI).');
        setResult(null);
        return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    // 1. Check Local Database first (Fastest, No CORS)
    const oui = clean.substring(0, 6);
    const ouiFormatted = `${oui[0]}${oui[1]}:${oui[2]}${oui[3]}:${oui[4]}${oui[5]}`;
    
    if (COMMON_VENDORS[ouiFormatted]) {
        setResult({
            company: COMMON_VENDORS[ouiFormatted],
            address: 'Common Vendor (Local DB)',
            country: 'Global',
            macPrefix: ouiFormatted
        });
        setSource('Local');
        setLoading(false);
        return;
    }

    // 2. Try Primary API (maclookup.app)
    try {
        const formattedMac = formatMac(clean);
        const res = await fetch(`https://api.maclookup.app/v2/macs/${formattedMac}`);
        
        if (res.ok) {
            const data = await res.json();
            if (data.found && data.company) {
                setResult(data);
                setSource('API');
                setLoading(false);
                return;
            }
        }
    } catch (e) {
        console.warn("Primary API failed", e);
    }

    // 3. Try Fallback API (macvendors.com) - Note: Returns plain text
    try {
        const formattedMac = formatMac(clean);
        const res = await fetch(`https://api.macvendors.com/${formattedMac}`);
        if (res.ok) {
            const text = await res.text();
            setResult({
                company: text,
                address: 'Unknown',
                country: 'Unknown',
                macPrefix: formattedMac.substring(0, 8)
            });
            setSource('API');
            setLoading(false);
            return;
        }
    } catch (e) {
        console.warn("Fallback API failed", e);
    }

    setError('Vendor not found or API blocked by ad-blocker. Try disabling extensions.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
      
      <nav className="border-b border-white/5 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer focus:outline-none">
            <Home className="text-slate-400 hover:text-white transition-colors" size={20} />
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            <Tag className="text-indigo-400" size={24} />
            <span className="text-lg font-bold tracking-tight text-white">MAC Lookup</span>
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        
        <div className="flex flex-col items-center justify-center mb-12 text-center animate-fade-in">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Cpu size={12} />
                Hardware ID
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
               MAC Address Vendor Lookup
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
                Identify device manufacturers. Includes a local database for instant, offline lookups of common brands like Apple and Cisco.
            </p>
        </div>

        <div className="bg-[#0f172a] rounded-[2rem] p-6 border border-white/5 shadow-2xl mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6 relative">
                <div className="flex-grow relative">
                    <input 
                        type="text" 
                        value={mac}
                        onChange={(e) => setMac(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && lookup()}
                        placeholder="00:1A:2B:3C:4D:5E"
                        className="w-full bg-[#020617] border border-white/10 rounded-xl px-5 py-4 text-white font-mono focus:outline-none focus:border-indigo-500/50 transition-colors uppercase pl-12"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    {mac && (
                        <button 
                            onClick={() => { setMac(''); setResult(null); setError(''); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                            <Delete size={18} />
                        </button>
                    )}
                </div>
                
                <button 
                    onClick={lookup}
                    disabled={loading || mac.length < 2}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]"
                >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Identify"}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3 animate-fade-in">
                    <AlertTriangle size={20} /> {error}
                </div>
            )}

            {result && (
                <div className="mt-8 bg-[#020617] p-8 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center gap-8 animate-fade-in relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 flex-shrink-0">
                        <Building2 size={32} className="text-indigo-400" />
                    </div>
                    <div className="flex-grow text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Manufacturer</span>
                            {source === 'Local' ? (
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                                    <Database size={8} /> Local DB
                                </span>
                            ) : (
                                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 flex items-center gap-1">
                                    <Wifi size={8} /> API
                                </span>
                            )}
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">{result.company}</div>
                        <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm text-slate-400 font-mono mt-4">
                            <span className="bg-slate-800 px-3 py-1 rounded-md border border-white/5">Prefix: {result.macPrefix}</span>
                            {result.address && <span className="bg-slate-800 px-3 py-1 rounded-md border border-white/5 max-w-xs truncate">Addr: {result.address}</span>}
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* SEO Content */}
        <section className="border-t border-white/5 pt-12 text-slate-400 space-y-8 max-w-4xl mx-auto">
             <h2 className="text-2xl font-bold text-white mb-4">What is a MAC Address?</h2>
             <p className="leading-relaxed">
                 A Media Access Control (MAC) address is a unique identifier assigned to a network interface controller (NIC) for use as a network address in communications within a network segment.
             </p>
             <p className="leading-relaxed">
                 The first 6 characters (e.g. <code>00:1A:2B</code>) are known as the OUI (Organizationally Unique Identifier). This prefix is assigned to the manufacturer (like Apple, Cisco, Intel) and can be used to identify the device brand.
             </p>
        </section>

      </main>
    </div>
  );
};