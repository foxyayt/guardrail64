import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { fetchIpData, IpData } from '../services/ipService';
import { Home, Shield, Globe, MapPin, Server, Copy, Check, RefreshCw, AlertTriangle, Fingerprint, Lock, Navigation } from 'lucide-react';

interface IpScannerPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const IpScannerPage: React.FC<IpScannerPageProps> = ({ onNavigate }) => {
  const [data, setData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchIpData();
      setData(result);
    } catch (err) {
      setError('Could not fetch IP details. Please disable ad-blockers and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopy = () => {
    if (data?.ip) {
      navigator.clipboard.writeText(data.ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer focus:outline-none">
            <Home className="text-slate-400 hover:text-white transition-colors" size={20} />
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            <Shield className="text-emerald-400 fill-emerald-400/20" size={24} />
            <span className="text-lg font-bold tracking-tight text-white">IP Scanner</span>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Header / Hero */}
        <div className="flex flex-col items-center justify-center mb-12 text-center animate-fade-in">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Globe size={12} />
                Public Identity
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
               What is my IP Address?
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
                Your IP address exposes your location and ISP to every website you visit. Analyze your digital footprint below.
            </p>
        </div>

        {loading ? (
           <div className="w-full h-96 flex flex-col items-center justify-center gap-4">
              <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-900"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
              </div>
              <p className="text-slate-500 font-mono text-sm animate-pulse">Scanning Network Identity...</p>
           </div>
        ) : error ? (
            <div className="max-w-xl mx-auto bg-red-900/20 border border-red-500/50 p-8 rounded-2xl text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Scan Failed</h3>
                <p className="text-slate-400 mb-6">{error}</p>
                <button onClick={loadData} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-colors">
                    Try Again
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in mb-12">
                
                {/* Main IP Card */}
                <div className="md:col-span-3 bg-[#0f172a] rounded-[2rem] p-8 md:p-12 border border-white/5 relative overflow-hidden text-center group">
                     <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
                     
                     <h2 className="text-slate-500 font-mono uppercase tracking-widest text-sm mb-4">Your Public IPv4 Address</h2>
                     <div className="flex items-center justify-center gap-4 mb-8">
                        <span className="text-5xl md:text-7xl font-black text-white tracking-tight break-all">
                            {data?.ip}
                        </span>
                     </div>
                     
                     <div className="flex justify-center gap-4">
                        <button 
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl font-bold transition-all active:scale-95"
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? "Copied" : "Copy IP"}
                        </button>
                        <button 
                            onClick={loadData}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all active:scale-95"
                        >
                            <RefreshCw size={18} /> Refresh
                        </button>
                     </div>
                </div>

                {/* Location Card */}
                <div className="bg-[#0f172a] rounded-[2rem] p-8 border border-white/5 flex flex-col items-start hover:border-emerald-500/30 transition-colors">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6">
                        <MapPin className="text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">Location</h3>
                    <p className="text-slate-400 text-sm mb-6">Based on your IP address</p>
                    
                    <div className="w-full space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-slate-500">City</span>
                            <span className="text-white font-medium">{data?.city}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-slate-500">Region</span>
                            <span className="text-white font-medium">{data?.region}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-slate-500">Country</span>
                            <span className="text-white font-medium">{data?.country_name}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-slate-500">Coords</span>
                            <span className="text-white font-mono text-xs">{data?.latitude.toFixed(2)}, {data?.longitude.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* ISP Card */}
                <div className="bg-[#0f172a] rounded-[2rem] p-8 border border-white/5 flex flex-col items-start hover:border-emerald-500/30 transition-colors">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6">
                        <Server className="text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">Provider</h3>
                    <p className="text-slate-400 text-sm mb-6">Network details</p>
                    
                    <div className="w-full space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-slate-500">ISP</span>
                            <span className="text-white font-medium text-right max-w-[150px] truncate" title={data?.org}>{data?.org}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-slate-500">ASN</span>
                            <span className="text-white font-medium">{data?.asn}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-slate-500">Timezone</span>
                            <span className="text-white font-medium">{data?.timezone}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-slate-500">Postal</span>
                            <span className="text-white font-medium">{data?.postal}</span>
                        </div>
                    </div>
                </div>

                {/* Tech Details Card */}
                <div className="bg-[#0f172a] rounded-[2rem] p-8 border border-white/5 flex flex-col items-start hover:border-emerald-500/30 transition-colors">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6">
                        <Fingerprint className="text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">System</h3>
                    <p className="text-slate-400 text-sm mb-6">Browser fingerprint</p>
                    
                    <div className="w-full space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-slate-500">Connection</span>
                            <span className="text-white font-medium">IPv4</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-slate-500">Currency</span>
                            <span className="text-white font-medium">{data?.currency}</span>
                        </div>
                         <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-slate-500">Calling Code</span>
                            <span className="text-white font-medium">{data?.country_calling_code}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-slate-500">EU Member</span>
                            <span className="text-white font-medium">{data?.in_eu ? "Yes" : "No"}</span>
                        </div>
                    </div>
                </div>
            </div>
        )}
        
        {/* SEO Content */}
        <section className="border-t border-white/5 pt-12 text-slate-400 space-y-8 max-w-4xl mx-auto">
             <h2 className="text-2xl font-bold text-white mb-4">Why Check Your IP Address?</h2>
             
             <div className="grid md:grid-cols-2 gap-8">
                <div>
                     <div className="flex items-center gap-2 mb-2 text-emerald-400">
                        <Navigation size={20} />
                        <h3 className="font-bold text-white">Geolocation Tracking</h3>
                    </div>
                    <p className="text-sm leading-relaxed">
                        Websites use your IP to determine your physical location (city and country). This allows them to restrict content (like Netflix regions) or serve local ads. Use this tool to verify what location you are broadcasting.
                    </p>
                </div>
                 <div>
                     <div className="flex items-center gap-2 mb-2 text-emerald-400">
                        <Lock size={20} />
                        <h3 className="font-bold text-white">Verify VPN Status</h3>
                    </div>
                    <p className="text-sm leading-relaxed">
                        If you are using a VPN or Proxy to hide your identity, this tool is essential. If you still see your real location or ISP name here, your VPN may have a "DNS Leak" or is not connected properly.
                    </p>
                </div>
             </div>
             
             <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5 text-sm">
                <p>
                    <strong>Note:</strong> The location shown is approximate. It represents the location of your Internet Service Provider's (ISP) data center, not your exact house address. This is why it may show a neighboring city.
                </p>
            </div>
        </section>

      </main>
    </div>
  );
};