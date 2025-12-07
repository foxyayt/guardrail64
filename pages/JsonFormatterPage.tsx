import React, { useState } from 'react';
import { PageRoute } from '../types';
import { Home, Code, FileJson, Check, Copy, Trash2, Minimize } from 'lucide-react';

interface JsonFormatterPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const JsonFormatterPage: React.FC<JsonFormatterPageProps> = ({ onNavigate }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const format = () => {
    try {
        const obj = JSON.parse(input);
        setInput(JSON.stringify(obj, null, 4));
        setError('');
    } catch (e) {
        if (e instanceof Error) setError(e.message);
    }
  };

  const minify = () => {
    try {
        const obj = JSON.parse(input);
        setInput(JSON.stringify(obj));
        setError('');
    } catch (e) {
        if (e instanceof Error) setError(e.message);
    }
  };

  const clear = () => {
    setInput('');
    setError('');
  };

  const copy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-yellow-500/30">
      
      <nav className="border-b border-white/5 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer focus:outline-none">
            <Home className="text-slate-400 hover:text-white transition-colors" size={20} />
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            <FileJson className="text-yellow-400" size={24} />
            <span className="text-lg font-bold tracking-tight text-white">JSON Tool</span>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-64px)] flex flex-col">
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <div>
                 <h1 className="text-2xl font-black text-white flex items-center gap-2">
                   <Code size={24} className="text-yellow-400"/> JSON Formatter
                </h1>
            </div>
            <div className="flex gap-2">
                <button onClick={clear} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                    <Trash2 size={16}/> Clear
                </button>
                <button onClick={minify} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                    <Minimize size={16}/> Minify
                </button>
                <button onClick={format} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-slate-900 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                    <Check size={16}/> Beautify
                </button>
            </div>
        </div>

        <div className="flex-grow relative">
            <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your JSON here..."
                className={`w-full h-full bg-[#0f172a] border rounded-2xl p-6 font-mono text-sm resize-none focus:outline-none transition-colors
                    ${error ? 'border-red-500 focus:border-red-500' : 'border-white/5 focus:border-yellow-500/50'}
                `}
                spellCheck="false"
            />
            
            <button 
                onClick={copy}
                className="absolute top-4 right-4 p-2 bg-slate-800/50 backdrop-blur hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors border border-white/5"
                title="Copy to Clipboard"
            >
                {copied ? <Check size={18} className="text-green-400"/> : <Copy size={18}/>}
            </button>

            {error && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-900/90 backdrop-blur border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm font-mono shadow-xl animate-fade-in">
                    Error: {error}
                </div>
            )}
        </div>

      </main>
    </div>
  );
};