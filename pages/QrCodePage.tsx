
import React, { useState, useEffect, useRef } from 'react';
import { PageRoute } from '../types';
import { Home, QrCode, Download, Link, Type, Wifi, Zap, Lock } from 'lucide-react';
import QRCode from 'qrcode';

interface QrCodePageProps {
  onNavigate: (page: PageRoute) => void;
}

export const QrCodePage: React.FC<QrCodePageProps> = ({ onNavigate }) => {
  const [input, setInput] = useState('https://example.com');
  const [dataUrl, setDataUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = async () => {
    if (!input) return;
    setLoading(true);
    try {
        const url = await QRCode.toDataURL(input, {
            width: 400,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });
        setDataUrl(url);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(generate, 500);
    return () => clearTimeout(timer);
  }, [input]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-white/30">
      
      <nav className="border-b border-white/5 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer focus:outline-none">
            <Home className="text-slate-400 hover:text-white transition-colors" size={20} />
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            <QrCode className="text-white" size={24} />
            <span className="text-lg font-bold tracking-tight text-white">QuickQR</span>
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12">
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            
            {/* Input Section */}
            <div>
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider mb-6">
                    <Link size={12} />
                    Free Generator
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                   Create QR Codes Instantly
                </h1>
                <p className="text-lg text-slate-400 mb-8">
                    Enter a URL, text, or email below. The code generates instantly in your browser. No data is sent to our servers.
                </p>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Content</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-white/30 transition-colors pl-12"
                                placeholder="https://..."
                            />
                            <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Section */}
            <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-6 rounded-3xl shadow-2xl mb-8 relative group">
                    {dataUrl ? (
                        <img src={dataUrl} alt="QR Code" className="w-64 h-64 md:w-80 md:h-80 object-contain" />
                    ) : (
                        <div className="w-64 h-64 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                            <QrCode size={48} />
                        </div>
                    )}
                </div>

                <a 
                    href={dataUrl} 
                    download="qrcode.png"
                    className={`flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-white/10
                        ${!dataUrl ? 'opacity-50 pointer-events-none' : ''}
                    `}
                >
                    <Download size={20} />
                    Download PNG
                </a>
            </div>

        </div>
        
        {/* SEO Content */}
        <section className="border-t border-white/5 pt-12 text-slate-400 space-y-8 max-w-4xl mx-auto">
             <h2 className="text-2xl font-bold text-white mb-4">About QuickQR Generator</h2>
             <p className="leading-relaxed">
                 QR Codes (Quick Response Codes) are 2D barcodes that can store URLs, text, and other data. They are easily scanned by smartphone cameras.
             </p>
             
             <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
                     <div className="flex items-center gap-2 mb-4 text-white">
                        <Wifi size={24} />
                        <h3 className="font-bold">Share Wi-Fi</h3>
                    </div>
                    <p className="text-sm">
                        Create codes that automatically connect guests to your Wi-Fi network without them needing to type passwords.
                    </p>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
                     <div className="flex items-center gap-2 mb-4 text-white">
                        <Zap size={24} />
                        <h3 className="font-bold">Instant Access</h3>
                    </div>
                    <p className="text-sm">
                        Perfect for restaurant menus, business cards, and marketing materials. Direct users to your website instantly.
                    </p>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
                     <div className="flex items-center gap-2 mb-4 text-white">
                        <Lock size={24} />
                        <h3 className="font-bold">Offline & Private</h3>
                    </div>
                    <p className="text-sm">
                        This tool runs 100% in your browser using HTML5 Canvas. We do not track your codes or store your data.
                    </p>
                </div>
             </div>
        </section>

      </main>
    </div>
  );
};