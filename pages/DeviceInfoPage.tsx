
import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { Home, Cpu, Smartphone, Monitor, Battery, Globe, Fingerprint, Info, Eye, Layers } from 'lucide-react';

interface DeviceInfoPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const DeviceInfoPage: React.FC<DeviceInfoPageProps> = ({ onNavigate }) => {
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    // Collect Data safely
    const nav = window.navigator as any;
    
    const data = {
        userAgent: nav.userAgent,
        platform: nav.platform,
        language: nav.language,
        cores: nav.hardwareConcurrency || 'Unknown',
        memory: nav.deviceMemory ? `${nav.deviceMemory} GB` : 'Unknown',
        screen: `${window.screen.width} x ${window.screen.height}`,
        depth: `${window.screen.colorDepth}-bit`,
        pixelRatio: window.devicePixelRatio,
        connection: nav.connection ? nav.connection.effectiveType : 'Unknown',
        touch: nav.maxTouchPoints > 0 ? 'Supported' : 'No',
        cookies: nav.cookieEnabled ? 'Enabled' : 'Disabled',
    };
    
    setInfo(data);

    // Battery separate due to promise
    if (nav.getBattery) {
        nav.getBattery().then((bat: any) => {
            setInfo((prev: any) => ({
                ...prev,
                battery: `${Math.round(bat.level * 100)}%`,
                charging: bat.charging ? 'Yes' : 'No'
            }));
        });
    }

  }, []);

  const Card = ({ title, value, icon: Icon, color }: any) => (
      <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5 flex flex-col gap-4 relative overflow-hidden group hover:border-white/10 transition-colors">
           <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                <Icon size={64} />
           </div>
           <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} bg-opacity-10 text-white`}>
                <Icon size={20} />
           </div>
           <div>
               <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</div>
               <div className="text-xl md:text-2xl font-bold text-white truncate" title={value}>{value || '--'}</div>
           </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-orange-500/30">
      
      <nav className="border-b border-white/5 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer focus:outline-none">
            <Home className="text-slate-400 hover:text-white transition-colors" size={20} />
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            <Fingerprint className="text-orange-400" size={24} />
            <span className="text-lg font-bold tracking-tight text-white">Device ID</span>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        
        <div className="flex flex-col items-center justify-center mb-12 text-center animate-fade-in">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Info size={12} />
                System Analysis
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
               Your Digital Fingerprint
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
                Websites can identify you based on your device configuration. See exactly what your browser reveals about your hardware and software.
            </p>
        </div>

        {info && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card title="OS Platform" value={info.platform} icon={Monitor} color="text-blue-400" />
                <Card title="Screen Res" value={info.screen} icon={Smartphone} color="text-indigo-400" />
                <Card title="CPU Cores" value={info.cores} icon={Cpu} color="text-red-400" />
                <Card title="Memory" value={info.memory} icon={Cpu} color="text-purple-400" />
                <Card title="Battery" value={info.battery} icon={Battery} color="text-green-400" />
                <Card title="Language" value={info.language} icon={Globe} color="text-yellow-400" />
                <Card title="Touch Support" value={info.touch} icon={Fingerprint} color="text-orange-400" />
                <Card title="Pixel Ratio" value={info.pixelRatio} icon={Monitor} color="text-cyan-400" />
            </div>
        )}

        <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5 mb-12">
             <h3 className="text-white font-bold mb-4">User Agent String</h3>
             <code className="block bg-black/30 p-4 rounded-xl text-slate-400 font-mono text-sm break-all border border-white/5">
                {info?.userAgent}
             </code>
        </div>
        
        {/* SEO Content */}
        <section className="border-t border-white/5 pt-12 text-slate-400 space-y-8 max-w-4xl mx-auto">
             <h2 className="text-2xl font-bold text-white mb-4">What is Browser Fingerprinting?</h2>
             
             <div className="grid md:grid-cols-2 gap-8">
                <div>
                     <div className="flex items-center gap-2 mb-2 text-orange-400">
                        <Fingerprint size={20} />
                        <h3 className="font-bold text-white">Unique Identification</h3>
                    </div>
                    <p className="text-sm leading-relaxed">
                        Even without cookies, advertisers can identify you by combining your screen resolution, operating system, fonts, and hardware info into a unique "fingerprint."
                    </p>
                </div>
                 <div>
                     <div className="flex items-center gap-2 mb-2 text-orange-400">
                        <Eye size={20} />
                        <h3 className="font-bold text-white">Hardware Disclosure</h3>
                    </div>
                    <p className="text-sm leading-relaxed">
                        Modern web APIs allow sites to read your battery level, CPU core count, and device memory. This tool shows you exactly what data is accessible to any website you visit.
                    </p>
                </div>
                <div>
                     <div className="flex items-center gap-2 mb-2 text-orange-400">
                        <Layers size={20} />
                        <h3 className="font-bold text-white">User Agent</h3>
                    </div>
                    <p className="text-sm leading-relaxed">
                        Your "User Agent" is a text string your browser sends to every web server. It reveals your browser version, OS version (e.g., Windows 10 vs macOS), and device type.
                    </p>
                </div>
             </div>
        </section>

      </main>
    </div>
  );
};