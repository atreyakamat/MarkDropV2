import React from 'react';
import ReactDOM from 'react-dom/client';
import { LayoutGrid, Play, Zap } from 'lucide-react';
import './index.css';

const Popup = () => {
  const handleStart = () => {
    // Send message to background to start the sync and open tab
    chrome.runtime.sendMessage({ action: "START_SYNC" });
    window.close(); // Close popup
  };

  return (
    <div className="w-[320px] p-6 bg-[#0F172A] text-white flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
          <LayoutGrid size={24} color="white" />
        </div>
        <h1 className="text-xl font-black tracking-tight">MarkDrop V2</h1>
      </div>

      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm opacity-60 leading-relaxed font-medium">
          Ready to transform your bookmarks into an intelligent dashboard?
        </p>
        
        <button 
          onClick={handleStart}
          className="group relative flex items-center justify-center gap-3 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-indigo-600/30 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <Play size={18} fill="currentColor" />
          <span className="relative z-10">Start Dashboard</span>
          <Zap size={14} className="animate-pulse text-yellow-400" />
        </button>
      </div>

      <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
        <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-white/30">
          <span>Mode</span>
          <span className="text-indigo-400">Native Dashboard</span>
        </div>
        <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-white/30">
          <span>Status</span>
          <span className="text-green-400">Ready</span>
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('popup-root')).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
