import React, { useState } from 'react';
import { PageRoute } from '../types';
import { Home, Globe, Search, Database, Server, CheckCircle, AlertCircle } from 'lucide-react';

interface DnsLookupPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const DnsLookupPage: React.FC<DnsLookupPageProps> = ({ onNavigate }) => {
  const [domain, setDomain] = useState('google.com');
  const [type, setType] = useState('A');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookup = async () => {
    if (!domain) return;
    setLoading(true);
    setError('');
    setResults([]);

    try {
        const res = await fetch(`https://dns.google/resolve?name=${domain}&type=${type}`);
        const data = await res.json();
        
        if (data.Status !== 0) {
            setError(`DNS Error Code: ${data.Status}`);
        } else if (data.Answer) {
            setResults(data.Answer);
        } else {
            setError('No records found.');
        }
    } catch (e) {
        setError('Failed to fetch DNS records.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-pink-500/30">
      
      <nav className="border-b border-white/5 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer focus:outline-none">
            <Home className="text-slate-400 hover:text-white transition-colors" size={20} />
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            <Globe className="text-pink-400" size={24} />
            <span className="text-lg font-bold tracking-tight text-white">DNS Look</span>
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        
        <div className="flex flex-col items-center justify-center mb-12 text-center animate-fade-in">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Database size={12} />
                Record Viewer
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
               DNS Records Lookup
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
                Check the propagation status of your domain names using Google's DNS-over-HTTPS resolver.
            </p>
        </div>

        <div className="bg-[#0f172a] rounded-[2rem] p-6 border border-white/5 shadow-2xl mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input 
                    type="text" 
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="example.com"
                    className="flex-grow bg-[#020617] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-pink-500/50 transition-colors"
                />
                <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="bg-[#020617] border border-white/10 rounded-xl px-6 py-4 text-white font-bold focus:outline-none focus:border-pink-500/50 cursor-pointer"
                >
                    <option value="A">A</option>
                    <option value="AAAA">AAAA</option>
                    <option value="MX">MX</option>
                    <option value="TXT">TXT</option>
                    <option value="CNAME">CNAME</option>
                    <option value="NS">NS</option>
                    <option value="SOA">SOA</option>
                </select>
                <button 
                    onClick={lookup}
                    disabled={loading}
                    className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-8 py-4 rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Search size={20} />}
                    Lookup
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {results.length > 0 && (
                <div className="space-y-3 mt-8">
                    {results.map((record, i) => (
                        <div key={i} className="bg-[#020617] p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:border-pink-500/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 font-bold text-xs">
                                    {type}
                                </div>
                                <div>
                                    <div className="text-white font-mono break-all">{record.data}</div>
                                    <div className="text-slate-500 text-xs mt-1">TTL: {record.TTL}s</div>
                                </div>
                            </div>
                            <CheckCircle size={16} className="text-emerald-500" />
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* SEO Content */}
        <section className="border-t border-white/5 pt-12 text-slate-400 space-y-8 max-w-4xl mx-auto">
             <h2 className="text-2xl font-bold text-white mb-4">Common DNS Records</h2>
             <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
                     <h3 className="font-bold text-white mb-2 text-pink-400">A Record</h3>
                     <p className="text-sm">Maps a domain name to an IPv4 address (e.g., 192.168.1.1).</p>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
                     <h3 className="font-bold text-white mb-2 text-pink-400">MX Record</h3>
                     <p className="text-sm">Mail Exchange records direct email to a mail server. Essential for receiving email.</p>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
                     <h3 className="font-bold text-white mb-2 text-pink-400">CNAME Record</h3>
                     <p className="text-sm">Canonical Name records map an alias name to a true or canonical domain name.</p>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
                     <h3 className="font-bold text-white mb-2 text-pink-400">TXT Record</h3>
                     <p className="text-sm">Used for verification records (SPF, DKIM, Google Site Verification) and arbitrary text.</p>
                </div>
             </div>
        </section>

      </main>
    </div>
  );
};