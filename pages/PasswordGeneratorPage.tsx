
import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { Home, Lock, Copy, RefreshCw, Check, ShieldCheck, History, Key, EyeOff, Shield } from 'lucide-react';

interface PasswordGeneratorPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const PasswordGeneratorPage: React.FC<PasswordGeneratorPageProps> = ({ onNavigate }) => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  const generatePassword = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (options.uppercase) chars += upper;
    if (options.lowercase) chars += lower;
    if (options.numbers) chars += nums;
    if (options.symbols) chars += syms;

    if (chars === '') return;

    let generated = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      generated += chars[array[i] % chars.length];
    }

    setPassword(generated);
    calculateStrength(generated);
    
    setHistory(prev => {
        const newHistory = [generated, ...prev].slice(0, 5);
        return newHistory;
    });
  };

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 8) score += 1;
    if (pass.length > 12) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    setStrength(score);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate on mount
  useEffect(() => {
    generatePassword();
  }, []);

  const getStrengthColor = () => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 4) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStrengthText = () => {
    if (strength <= 2) return 'Weak';
    if (strength <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-purple-500/30">
      
      <nav className="border-b border-white/5 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer focus:outline-none">
            <Home className="text-slate-400 hover:text-white transition-colors" size={20} />
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            <Lock className="text-purple-400 fill-purple-400/20" size={24} />
            <span className="text-lg font-bold tracking-tight text-white">SecurePass</span>
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        
        <div className="flex flex-col items-center justify-center mb-12 text-center animate-fade-in">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6">
                <ShieldCheck size={12} />
                Military Grade
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
               Generate Unhackable Passwords
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
                Create cryptographically secure credentials instantly. Your passwords are generated locally in your browser and never sent to a server.
            </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#0f172a] rounded-[2rem] p-8 border border-white/5 relative overflow-hidden shadow-2xl mb-8">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
             
             {/* Display */}
             <div className="bg-[#020617] rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 mb-8 relative group">
                <div className="font-mono text-2xl md:text-3xl text-white break-all text-center md:text-left tracking-wide">
                    {password}
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => handleCopy(password)}
                        className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all active:scale-95"
                        title="Copy"
                    >
                        {copied ? <Check size={20} className="text-green-400"/> : <Copy size={20}/>}
                    </button>
                    <button 
                        onClick={generatePassword}
                        className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-500/20"
                        title="Regenerate"
                    >
                        <RefreshCw size={20}/>
                    </button>
                </div>
             </div>

             {/* Strength Meter */}
             <div className="mb-8">
                <div className="flex justify-between items-center mb-2 text-sm font-bold uppercase tracking-wider">
                    <span className="text-slate-500">Security Strength</span>
                    <span className={`${strength <= 2 ? 'text-red-400' : strength <= 4 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {getStrengthText()}
                    </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1">
                    <div className={`h-full flex-1 rounded-full transition-colors ${strength >= 1 ? getStrengthColor() : 'bg-slate-800'}`}></div>
                    <div className={`h-full flex-1 rounded-full transition-colors ${strength >= 2 ? getStrengthColor() : 'bg-slate-800'}`}></div>
                    <div className={`h-full flex-1 rounded-full transition-colors ${strength >= 3 ? getStrengthColor() : 'bg-slate-800'}`}></div>
                    <div className={`h-full flex-1 rounded-full transition-colors ${strength >= 4 ? getStrengthColor() : 'bg-slate-800'}`}></div>
                    <div className={`h-full flex-1 rounded-full transition-colors ${strength >= 5 ? getStrengthColor() : 'bg-slate-800'}`}></div>
                </div>
             </div>

             {/* Controls */}
             <div className="grid md:grid-cols-2 gap-8">
                 <div>
                    <label className="text-slate-400 font-bold mb-4 block">Password Length: <span className="text-white">{length}</span></label>
                    <input 
                        type="range" min="8" max="64" value={length} 
                        onChange={(e) => setLength(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    {Object.entries(options).map(([key, value]) => (
                        <label key={key} className="flex items-center gap-3 cursor-pointer select-none group">
                            <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors
                                ${value ? 'bg-purple-500 border-purple-500' : 'bg-transparent border-slate-600 group-hover:border-slate-400'}
                            `}>
                                {value && <Check size={14} className="text-white" />}
                            </div>
                            <input 
                                type="checkbox" className="hidden" 
                                checked={value} 
                                onChange={() => setOptions(prev => ({...prev, [key]: !prev[key as keyof typeof options]}))}
                            />
                            <span className="capitalize text-slate-300 font-medium">{key}</span>
                        </label>
                    ))}
                 </div>
             </div>
        </div>

        {/* History */}
        {history.length > 0 && (
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/5 mb-12">
                <h3 className="text-slate-400 font-bold mb-4 flex items-center gap-2">
                    <History size={16}/> Recent (Stored Locally)
                </h3>
                <div className="space-y-2">
                    {history.map((pass, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-white/5 group hover:border-white/10">
                            <span className="font-mono text-slate-400 truncate max-w-[200px] md:max-w-md">
                                {pass.substring(0, 4)}••••••••{pass.substring(pass.length-4)}
                            </span>
                            <button 
                                onClick={() => handleCopy(pass)}
                                className="text-slate-500 hover:text-white transition-colors text-sm font-bold"
                            >
                                Copy
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* SEO Content */}
        <section className="border-t border-white/5 pt-12 text-slate-400 space-y-8 max-w-4xl mx-auto">
             <h2 className="text-2xl font-bold text-white mb-4">Why use a Strong Password Generator?</h2>
             
             <div className="grid md:grid-cols-2 gap-8">
                <div>
                     <div className="flex items-center gap-2 mb-2 text-purple-400">
                        <Shield size={20} />
                        <h3 className="font-bold text-white">Prevent Brute Force Attacks</h3>
                    </div>
                    <p className="text-sm leading-relaxed">
                        Hackers use automated tools to guess simple passwords in seconds. A strong password created by a random generator (with mixed case, numbers, and symbols) can take trillions of years to crack.
                    </p>
                </div>
                 <div>
                     <div className="flex items-center gap-2 mb-2 text-purple-400">
                        <EyeOff size={20} />
                        <h3 className="font-bold text-white">Client-Side Privacy</h3>
                    </div>
                    <p className="text-sm leading-relaxed">
                        Unlike online tools that might log your data, our <strong>SecurePass</strong> generator runs entirely in your browser using the <code>window.crypto</code> API. The passwords you generate never leave your device.
                    </p>
                </div>
                <div>
                     <div className="flex items-center gap-2 mb-2 text-purple-400">
                        <Key size={20} />
                        <h3 className="font-bold text-white">High Entropy Credentials</h3>
                    </div>
                    <p className="text-sm leading-relaxed">
                        Humans are bad at being random. We use patterns like "123" or birth years. This tool ensures mathematical randomness (entropy), creating secure credentials for your email, banking, and social media accounts.
                    </p>
                </div>
             </div>
        </section>

      </main>
    </div>
  );
};