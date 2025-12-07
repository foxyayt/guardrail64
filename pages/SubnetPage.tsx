
import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { Home, Network, Calculator, Grid, ArrowRight, Layers, Share2 } from 'lucide-react';

interface SubnetPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const SubnetPage: React.FC<SubnetPageProps> = ({ onNavigate }) => {
  const [ip, setIp] = useState('192.168.1.1');
  const [cidr, setCidr] = useState(24);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    // Basic validation
    const ipParts = ip.split('.').map(Number);
    if (ipParts.length !== 4 || ipParts.some(p => isNaN(p) || p < 0 || p > 255)) {
        setResult(null);
        return;
    }

    // Calculations
    const maskBin = parseInt("1".repeat(cidr) + "0".repeat(32 - cidr), 2);
    const ipBin = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
    
    // Network Address: IP AND Mask
    // Note: JS bitwise operations are 32-bit signed. Use >>> 0 to treat as unsigned.
    const netAddrBin = (ipBin & maskBin) >>> 0;
    
    // Broadcast Address: Network OR (NOT Mask)
    const broadcastBin = (netAddrBin | (~maskBin)) >>> 0;
    
    const firstHostBin = (netAddrBin + 1) >>> 0;
    const lastHostBin = (broadcastBin - 1) >>> 0;
    
    const numHosts = Math.pow(2, 32 - cidr) - 2;

    const toIp = (int: number) => {
        return [
            (int >>> 24) & 0xFF,
            (int >>> 16) & 0xFF,
            (int >>> 8) & 0xFF,
            int & 0xFF
        ].join('.');
    };

    setResult({
        networkAddress: toIp(netAddrBin),
        broadcastAddress: toIp(broadcastBin),
        subnetMask: toIp(maskBin),
        firstHost: toIp(firstHostBin),
        lastHost: toIp(lastHostBin),
        hosts: numHosts > 0 ? numHosts : 0,
        usable: numHosts > 0,
        type: (ipParts[0] === 10) || (ipParts[0] === 172 && ipParts[1] >= 16 && ipParts[1] <= 31) || (ipParts[0] === 192 && ipParts[1] === 168) ? 'Private' : 'Public',
        cidr: cidr
    });
  };

  useEffect(() => {
    calculate();
  }, [ip, cidr]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30">
      
      <nav className="border-b border-white/5 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer focus:outline-none">
            <Home className="text-slate-400 hover:text-white transition-colors" size={20} />
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            <Network className="text-blue-400" size={24} />
            <span className="text-lg font-bold tracking-tight text-white">Subnet Calc</span>
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12">
        
        <div className="flex flex-col items-center justify-center mb-12 text-center animate-fade-in">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Calculator size={12} />
                CIDR / IPv4
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
               Subnet Calculator
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
                Visualize network ranges, netmasks, and wildcards. Essential for network configuration and planning.
            </p>
        </div>

        {/* Calculator UI */}
        <div className="grid md:grid-cols-12 gap-6 mb-12">
            
            {/* Controls */}
            <div className="md:col-span-5 bg-[#0f172a] rounded-[2rem] p-6 border border-white/5 shadow-xl h-fit">
                 <div className="mb-6">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 block">IP Address</label>
                    <input 
                        type="text" 
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                        className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-blue-500/50 transition-colors"
                        placeholder="192.168.1.1"
                    />
                 </div>

                 <div className="mb-8">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 block flex justify-between">
                        <span>CIDR / Mask</span>
                        <span className="text-blue-400">/{cidr}</span>
                    </label>
                    <input 
                        type="range" min="1" max="32" 
                        value={cidr}
                        onChange={(e) => setCidr(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-4"
                    />
                    <div className="grid grid-cols-4 gap-2 text-xs font-mono text-slate-500">
                        <button onClick={() => setCidr(8)} className={`p-2 rounded border transition-colors ${cidr === 8 ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-white/5 hover:bg-slate-800'}`}>/8</button>
                        <button onClick={() => setCidr(16)} className={`p-2 rounded border transition-colors ${cidr === 16 ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-white/5 hover:bg-slate-800'}`}>/16</button>
                        <button onClick={() => setCidr(24)} className={`p-2 rounded border transition-colors ${cidr === 24 ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-white/5 hover:bg-slate-800'}`}>/24</button>
                        <button onClick={() => setCidr(30)} className={`p-2 rounded border transition-colors ${cidr === 30 ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-white/5 hover:bg-slate-800'}`}>/30</button>
                    </div>
                 </div>

                 <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-2">Network Class</div>
                    <div className="text-white font-bold flex items-center gap-2">
                        <Layers size={16} className="text-slate-400" />
                        {result?.type || '--'} Network
                    </div>
                 </div>
            </div>

            {/* Results */}
            <div className="md:col-span-7 space-y-4">
                {result ? (
                    <>
                        <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
                             <div className="text-xs text-slate-500 uppercase font-bold mb-1">Subnet Mask</div>
                             <div className="text-2xl font-mono font-bold text-white break-all">{result.subnetMask}</div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Network Address</div>
                                <div className="text-xl font-mono font-bold text-blue-400 break-all">{result.networkAddress}</div>
                            </div>
                            <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Broadcast Address</div>
                                <div className="text-xl font-mono font-bold text-purple-400 break-all">{result.broadcastAddress}</div>
                            </div>
                        </div>

                        <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5">
                            <div className="text-xs text-slate-500 uppercase font-bold mb-4">Usable Host Range</div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="bg-black/30 px-4 py-2 rounded-lg border border-white/10 font-mono text-white">
                                    {result.firstHost}
                                </div>
                                <ArrowRight className="text-slate-600 hidden sm:block" />
                                <div className="text-slate-600 font-bold sm:hidden">TO</div>
                                <div className="bg-black/30 px-4 py-2 rounded-lg border border-white/10 font-mono text-white">
                                    {result.lastHost}
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                            <div>
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Total Usable Hosts</div>
                                <div className="text-3xl font-black text-white">{result.hosts.toLocaleString()}</div>
                            </div>
                            <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                                <Grid className="text-blue-400" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-500 bg-[#0f172a] rounded-2xl border border-white/5 border-dashed">
                        Enter a valid IP address
                    </div>
                )}
            </div>

        </div>

        {/* SEO Content */}
        <section className="border-t border-white/5 pt-12 text-slate-400 space-y-8 max-w-4xl mx-auto">
             <h2 className="text-2xl font-bold text-white mb-4">Understanding Subnets</h2>
             
             <div className="grid md:grid-cols-2 gap-8">
                <div>
                     <h3 className="font-bold text-white mb-2 text-blue-400">CIDR Notation</h3>
                     <p className="text-sm">
                        Classless Inter-Domain Routing (CIDR) is a method for allocating IP addresses and IP routing. It replaces the older class-based system (Class A, B, C) with a more flexible suffix (e.g., /24).
                     </p>
                </div>
                 <div>
                     <h3 className="font-bold text-white mb-2 text-blue-400">Subnet Mask</h3>
                     <p className="text-sm">
                        A 32-bit number that masks an IP address and divides the IP address into network address and host address. For example, 255.255.255.0 is the mask for a /24 network.
                     </p>
                </div>
             </div>
        </section>

      </main>
    </div>
  );
};
