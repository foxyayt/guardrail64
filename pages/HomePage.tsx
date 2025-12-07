import React from 'react';
import { Zap, Activity, Shield, ArrowRight, LayoutGrid, Cpu, Lock, QrCode, Fingerprint, Network, DownloadCloud, Globe, Tag, FileJson, Router, CloudSun } from 'lucide-react';
import { PageRoute } from '../types';

interface HomePageProps {
    onNavigate: (page: PageRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30 flex flex-col">
      
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="text-cyan-400" size={24} />
            <span className="text-lg font-bold tracking-tight text-white">Guardrail64</span>
          </div>
          <div>
            <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors border border-white/5">
                Contact Us
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/20 blur-[120px] rounded-full opacity-30 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Cpu size={12} />
                Next Gen Utilities
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                Essential Tools for the <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Modern Web</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
                A collection of high-performance, privacy-focused browser utilities designed for developers, gamers, and professionals.
            </p>
        </div>
      </section>

      {/* Apps Grid */}
      <section className="flex-grow max-w-7xl mx-auto px-6 pb-20 w-full -mt-20 relative z-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* SpeedFlow App Card -> Renamed to Internet Speed Test */}
            <div 
               onClick={() => onNavigate('speed-test')}
               className="group bg-[#0f172a] rounded-3xl p-8 border border-white/5 hover:border-cyan-500/50 hover:bg-[#1e293b] transition-all duration-300 relative overflow-hidden cursor-pointer shadow-xl hover:shadow-cyan-500/10 block select-none"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none"></div>
                
                <div className="w-14 h-14 bg-[#020617] rounded-2xl flex items-center justify-center border border-white/10 mb-6 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                    <Zap className="text-cyan-400 fill-cyan-400" size={28} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">Internet Speed Test</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    Professional grade internet speed test. Measure latency, jitter, and bandwidth with high-precision fiber optics simulation.
                </p>
                
                <div className="flex items-center text-cyan-400 font-bold group-hover:translate-x-2 transition-transform pointer-events-none">
                    Launch App <ArrowRight size={18} className="ml-2" />
                </div>
            </div>

            {/* Weather App Card */}
            <div 
                onClick={() => onNavigate('weather')}
                className="group bg-[#0f172a] rounded-3xl p-8 border border-white/5 hover:border-sky-500/50 hover:bg-[#1e293b] transition-all duration-300 relative overflow-hidden cursor-pointer shadow-xl hover:shadow-sky-500/10 block select-none"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all pointer-events-none"></div>

                <div className="w-14 h-14 bg-[#020617] rounded-2xl flex items-center justify-center border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                    <CloudSun className="text-sky-400 fill-sky-400/20" size={28} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">Weather</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    Beautiful real-time weather dashboard. Check temperatures, 14-day forecasts, and humidity for any city globally.
                </p>

                <div className="flex items-center text-sky-400 font-bold group-hover:translate-x-2 transition-transform pointer-events-none">
                    Launch App <ArrowRight size={18} className="ml-2" />
                </div>
            </div>

            {/* IP Scanner App Card */}
            <div 
                onClick={() => onNavigate('ip-scanner')}
                className="group bg-[#0f172a] rounded-3xl p-8 border border-white/5 hover:border-emerald-500/50 hover:bg-[#1e293b] transition-all duration-300 relative overflow-hidden cursor-pointer shadow-xl hover:shadow-emerald-500/10 block select-none"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none"></div>

                <div className="w-14 h-14 bg-[#020617] rounded-2xl flex items-center justify-center border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                    <Shield className="text-emerald-400 fill-emerald-400/20" size={28} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">IP Scanner</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    Analyze your public network identity. View your exposed IPv4 address, geolocation details, ISP, and ASN information.
                </p>

                <div className="flex items-center text-emerald-400 font-bold group-hover:translate-x-2 transition-transform pointer-events-none">
                    Launch App <ArrowRight size={18} className="ml-2" />
                </div>
            </div>

            {/* Ping Monitor Card */}
            <div 
                onClick={() => onNavigate('ping-monitor')}
                className="group bg-[#0f172a] rounded-3xl p-8 border border-white/5 hover:border-amber-500/50 hover:bg-[#1e293b] transition-all duration-300 relative overflow-hidden cursor-pointer shadow-xl hover:shadow-amber-500/10 block select-none"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none"></div>

                <div className="w-14 h-14 bg-[#020617] rounded-2xl flex items-center justify-center border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                    <Activity className="text-amber-400 fill-amber-400/20" size={28} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">Ping Monitor</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    Real-time latency monitoring dashboard. Track packet loss, jitter, and connection stability with live graphs.
                </p>

                <div className="flex items-center text-amber-400 font-bold group-hover:translate-x-2 transition-transform pointer-events-none">
                    Launch App <ArrowRight size={18} className="ml-2" />
                </div>
            </div>

            {/* Subnet Calc Card */}
            <div 
                onClick={() => onNavigate('subnet-calc')}
                className="group bg-[#0f172a] rounded-3xl p-8 border border-white/5 hover:border-blue-500/50 hover:bg-[#1e293b] transition-all duration-300 relative overflow-hidden cursor-pointer shadow-xl hover:shadow-blue-500/10 block select-none"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all pointer-events-none"></div>

                <div className="w-14 h-14 bg-[#020617] rounded-2xl flex items-center justify-center border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                    <Network className="text-blue-400 fill-blue-400/20" size={28} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">Subnet Calc</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    Advanced IPv4 Calculator. Calculate network ranges, CIDR masks, and usable hosts for network planning.
                </p>

                <div className="flex items-center text-blue-400 font-bold group-hover:translate-x-2 transition-transform pointer-events-none">
                    Launch App <ArrowRight size={18} className="ml-2" />
                </div>
            </div>

            {/* File Transfer Card */}
            <div 
                onClick={() => onNavigate('file-transfer')}
                className="group bg-[#0f172a] rounded-3xl p-8 border border-white/5 hover:border-teal-500/50 hover:bg-[#1e293b] transition-all duration-300 relative overflow-hidden cursor-pointer shadow-xl hover:shadow-teal-500/10 block select-none"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all pointer-events-none"></div>

                <div className="w-14 h-14 bg-[#020617] rounded-2xl flex items-center justify-center border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                    <DownloadCloud className="text-teal-400 fill-teal-400/20" size={28} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">Transfer Calc</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    Estimate upload and download times based on file size and speed. Essential for planning large backups.
                </p>

                <div className="flex items-center text-teal-400 font-bold group-hover:translate-x-2 transition-transform pointer-events-none">
                    Launch App <ArrowRight size={18} className="ml-2" />
                </div>
            </div>

            {/* DNS Lookup Card */}
            <div 
                onClick={() => onNavigate('dns-lookup')}
                className="group bg-[#0f172a] rounded-3xl p-8 border border-white/5 hover:border-pink-500/50 hover:bg-[#1e293b] transition-all duration-300 relative overflow-hidden cursor-pointer shadow-xl hover:shadow-pink-500/10 block select-none"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all pointer-events-none"></div>

                <div className="w-14 h-14 bg-[#020617] rounded-2xl flex items-center justify-center border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                    <Globe className="text-pink-400 fill-pink-400/20" size={28} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">DNS Lookup</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    Check DNS records (A, MX, CNAME, TXT) instantly using Google's DNS-over-HTTPS resolver.
                </p>

                <div className="flex items-center text-pink-400 font-bold group-hover:translate-x-2 transition-transform pointer-events-none">
                    Launch App <ArrowRight size={18} className="ml-2" />
                </div>
            </div>

            {/* MAC Lookup Card */}
            <div 
                onClick={() => onNavigate('mac-lookup')}
                className="group bg-[#0f172a] rounded-3xl p-8 border border-white/5 hover:border-indigo-500/50 hover:bg-[#1e293b] transition-all duration-300 relative overflow-hidden cursor-pointer shadow-xl hover:shadow-indigo-500/10 block select-none"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none"></div>

                <div className="w-14 h-14 bg-[#020617] rounded-2xl flex items-center justify-center border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                    <Tag className="text-indigo-400 fill-indigo-400/20" size={28} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">MAC Lookup</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    Identify device manufacturers from MAC addresses. Check OUI vendors for network troubleshooting.
                </p>

                <div className="flex items-center text-indigo-400 font-bold group-hover:translate-x-2 transition-transform pointer-events-none">
                    Launch App <ArrowRight size={18} className="ml-2" />
                </div>
            </div>

            {/* JSON Formatter Card */}
            <div 
                onClick={() => onNavigate('json-format')}
                className="group bg-[#0f172a] rounded-3xl p-8 border border-white/5 hover:border-yellow-500/50 hover:bg-[#1e293b] transition-all duration-300 relative overflow-hidden cursor-pointer shadow-xl hover:shadow-yellow-500/10 block select-none"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-all pointer-events-none"></div>

                <div className="w-14 h-14 bg-[#020617] rounded-2xl flex items-center justify-center border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                    <FileJson className="text-yellow-400 fill-yellow-400/20" size={28} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">JSON Tool</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    Validate, beautify, and minify JSON data. Essential debugging tool for web developers.
                </p>

                <div className="flex items-center text-yellow-400 font-bold group-hover:translate-x-2 transition-transform pointer-events-none">
                    Launch App <ArrowRight size={18} className="ml-2" />
                </div>
            </div>

            {/* Port Tester Card */}
            <div 
                onClick={() => onNavigate('port-test')}
                className="group bg-[#0f172a] rounded-3xl p-8 border border-white/5 hover:border-red-500/50 hover:bg-[#1e293b] transition-all duration-300 relative overflow-hidden cursor-pointer shadow-xl hover:shadow-red-500/10 block select-none"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all pointer-events-none"></div>

                <div className="w-14 h-14 bg-[#020617] rounded-2xl flex items-center justify-center border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                    <Router className="text-red-400 fill-red-400/20" size={28} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">Port Tester</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    Check if specific ports (80, 443) are open on a target server using standard HTTP probes.
                </p>

                <div className="flex items-center text-red-400 font-bold group-hover:translate-x-2 transition-transform pointer-events-none">
                    Launch App <ArrowRight size={18} className="ml-2" />
                </div>
            </div>

            {/* SecurePass Card */}
            <div 
                onClick={() => onNavigate('password-generator')}
                className="group bg-[#0f172a] rounded-3xl p-8 border border-white/5 hover:border-purple-500/50 hover:bg-[#1e293b] transition-all duration-300 relative overflow-hidden cursor-pointer shadow-xl hover:shadow-purple-500/10 block select-none"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none"></div>

                <div className="w-14 h-14 bg-[#020617] rounded-2xl flex items-center justify-center border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                    <Lock className="text-purple-400 fill-purple-400/20" size={28} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">SecurePass</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    Military-grade password generator. Create cryptographically secure credentials locally in your browser.
                </p>

                <div className="flex items-center text-purple-400 font-bold group-hover:translate-x-2 transition-transform pointer-events-none">
                    Launch App <ArrowRight size={18} className="ml-2" />
                </div>
            </div>

            {/* QuickQR Card */}
            <div 
                onClick={() => onNavigate('qr-code')}
                className="group bg-[#0f172a] rounded-3xl p-8 border border-white/5 hover:border-white/50 hover:bg-[#1e293b] transition-all duration-300 relative overflow-hidden cursor-pointer shadow-xl hover:shadow-white/10 block select-none"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all pointer-events-none"></div>

                <div className="w-14 h-14 bg-[#020617] rounded-2xl flex items-center justify-center border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                    <QrCode className="text-white fill-white/20" size={28} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">QuickQR</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    Privacy-focused QR code studio. Generate codes for links, text, and wifi offline without tracking.
                </p>

                <div className="flex items-center text-white font-bold group-hover:translate-x-2 transition-transform pointer-events-none">
                    Launch App <ArrowRight size={18} className="ml-2" />
                </div>
            </div>

             {/* DeviceInfo Card */}
             <div 
                onClick={() => onNavigate('device-info')}
                className="group bg-[#0f172a] rounded-3xl p-8 border border-white/5 hover:border-orange-500/50 hover:bg-[#1e293b] transition-all duration-300 relative overflow-hidden cursor-pointer shadow-xl hover:shadow-orange-500/10 block select-none"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all pointer-events-none"></div>

                <div className="w-14 h-14 bg-[#020617] rounded-2xl flex items-center justify-center border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                    <Fingerprint className="text-orange-400 fill-orange-400/20" size={28} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">Device ID</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    See what websites know about you. Analyze your browser's digital fingerprint, screen data, and hardware.
                </p>

                <div className="flex items-center text-orange-400 font-bold group-hover:translate-x-2 transition-transform pointer-events-none">
                    Launch App <ArrowRight size={18} className="ml-2" />
                </div>
            </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#020617] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-slate-500 text-sm">
                &copy; {new Date().getFullYear()} Guardrail64. All rights reserved.
            </div>
            <div className="flex gap-6">
                <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Terms of Service</a>
            </div>
        </div>
      </footer>
    </div>
  );
};