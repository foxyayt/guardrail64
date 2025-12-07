
import React, { useState, useRef } from 'react';
import { PageRoute } from '../types';
import { Home, Video, Mic, Square, Download, Monitor, AlertCircle, Film } from 'lucide-react';

interface ScreenRecorderPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const ScreenRecorderPage: React.FC<ScreenRecorderPageProps> = ({ onNavigate }) => {
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [videoURL, setVideoURL] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [options, setOptions] = useState({ audio: true });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  const startRecording = async () => {
    try {
      // Request screen share
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: options.audio
      });

      // If audio is requested, try to get mic as well (optional advanced feature, simplified here to system audio)
      
      const mediaRecorder = new MediaRecorder(displayStream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorder.onstop = () => {
        const tracks = displayStream.getTracks();
        tracks.forEach(track => track.stop());
        setStream(null);
        setRecording(false);
      };

      // Set Preview
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = displayStream;
      }

      mediaRecorder.start();
      setRecording(true);
      setStream(displayStream);
      setRecordedChunks([]);
      setVideoURL('');

      // Handle user clicking "Stop Sharing" on the browser native bar
      displayStream.getVideoTracks()[0].onended = () => {
         stopRecording();
      };

    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  // Process video when chunks change and recording stops
  React.useEffect(() => {
    if (!recording && recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoURL(url);
    }
  }, [recording, recordedChunks]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-rose-500/30">
      
      <nav className="border-b border-white/5 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer focus:outline-none">
            <Home className="text-slate-400 hover:text-white transition-colors" size={20} />
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            <Video className="text-rose-400" size={24} />
            <span className="text-lg font-bold tracking-tight text-white">Web Recorder</span>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        
        <div className="flex flex-col items-center justify-center mb-12 text-center animate-fade-in">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Film size={12} />
                No Watermarks
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
               Free Screen Recorder
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
                Capture your screen instantly directly from your browser. No downloads, no sign-ups, and no cloud uploads.
            </p>
        </div>

        {/* Recorder UI */}
        <div className="bg-[#0f172a] rounded-[2rem] p-4 md:p-8 border border-white/5 relative overflow-hidden shadow-2xl mb-8">
             
             {/* Viewport */}
             <div className="aspect-video bg-black rounded-2xl overflow-hidden relative mb-8 border border-white/10 group">
                {!stream && !videoURL && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                        <Monitor size={64} className="mb-4 opacity-50" />
                        <p>Preview will appear here</p>
                    </div>
                )}
                
                {/* Live Stream */}
                <video 
                    ref={videoPreviewRef} 
                    autoPlay 
                    muted 
                    className={`w-full h-full object-contain ${!recording ? 'hidden' : ''}`} 
                />

                {/* Playback */}
                {!recording && videoURL && (
                    <video 
                        src={videoURL} 
                        controls 
                        className="w-full h-full object-contain" 
                    />
                )}

                {recording && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full"></div> REC
                    </div>
                )}
             </div>

             {/* Controls */}
             <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                
                {!recording && !videoURL && (
                     <button 
                        onClick={startRecording}
                        className="group flex items-center gap-3 px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_-5px_rgba(225,29,72,0.4)]"
                     >
                        <div className="p-1 bg-white rounded-full">
                            <div className="w-4 h-4 bg-rose-600 rounded-full"></div>
                        </div>
                        Start Recording
                     </button>
                )}

                {recording && (
                    <button 
                        onClick={stopRecording}
                        className="flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 border border-white/10"
                    >
                        <Square size={20} className="fill-white" />
                        Stop Recording
                    </button>
                )}

                {videoURL && (
                    <div className="flex gap-4">
                         <button 
                            onClick={startRecording}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
                        >
                            New Recording
                        </button>
                        <a 
                            href={videoURL}
                            download={`recording-${Date.now()}.webm`}
                            className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-900/20"
                        >
                            <Download size={20} />
                            Download Video
                        </a>
                    </div>
                )}
             </div>

             <div className="mt-8 flex justify-center gap-6 text-sm text-slate-400">
                 <label className="flex items-center gap-2 cursor-pointer select-none">
                     <input 
                        type="checkbox" 
                        checked={options.audio} 
                        onChange={(e) => setOptions(p => ({...p, audio: e.target.checked}))}
                        disabled={recording}
                        className="accent-rose-500" 
                     />
                     <span className="flex items-center gap-2"><Mic size={14} /> Record Audio</span>
                 </label>
             </div>

        </div>

        {/* SEO Content */}
        <section className="border-t border-white/5 pt-12 text-slate-400 space-y-8 max-w-4xl mx-auto">
             <h2 className="text-2xl font-bold text-white mb-4">Private & Local Screen Recording</h2>
             
             <div className="grid md:grid-cols-2 gap-8">
                <div>
                     <div className="flex items-center gap-2 mb-2 text-rose-400">
                        <AlertCircle size={20} />
                        <h3 className="font-bold text-white">How it works</h3>
                    </div>
                    <p className="text-sm leading-relaxed">
                        This tool uses the modern <code>getDisplayMedia</code> API built into your browser. The video feed is processed locally and saved to your device's memory (RAM) until you download it. Nothing is ever uploaded to a cloud server.
                    </p>
                </div>
                 <div>
                     <div className="flex items-center gap-2 mb-2 text-rose-400">
                        <Video size={20} />
                        <h3 className="font-bold text-white">Format Support</h3>
                    </div>
                    <p className="text-sm leading-relaxed">
                        Recordings are saved in <strong>WebM</strong> format, which is optimized for the web. You can play these files in any modern browser (Chrome, Firefox, Edge) or VLC Media Player.
                    </p>
                </div>
             </div>
        </section>

      </main>
    </div>
  );
};