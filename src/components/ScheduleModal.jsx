import React, { useState } from 'react';
import { X, Clock, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScheduleModal = ({ bookmark, theme, isOpen, onClose, onSchedule }) => {
  const [minutes, setMinutes] = useState(60);
  const isNeo = theme === 'neo';

  const presets = [
    { label: 'Tonight', mins: 240 },
    { label: 'Tomorrow', mins: 1440 },
    { label: 'Weekend', mins: 4320 },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className={`relative w-full max-w-md p-8 ${isNeo ? 'neo-card bg-white rounded-none' : 'glass-card rounded-3xl'}`}
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors">
            <X size={20} className={isNeo ? 'text-black' : 'text-white'} />
          </button>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${isNeo ? 'bg-neo-pink border-2 border-black' : 'bg-pink-500/20 text-pink-400'}`}>
                <Clock size={24} />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isNeo ? 'text-black' : 'text-white'}`}>Schedule Revisit</h2>
                <p className={`text-sm opacity-60 ${isNeo ? 'text-black' : 'text-white'}`}>Choose when you'd like to check this again.</p>
              </div>
            </div>

            <div className={`p-4 rounded-xl ${isNeo ? 'bg-black/5' : 'bg-white/5 border border-white/10'}`}>
              <span className={`text-sm font-bold block mb-1 truncate ${isNeo ? 'text-black' : 'text-white'}`}>{bookmark.title}</span>
              <span className={`text-xs opacity-50 block truncate ${isNeo ? 'text-black' : 'text-white'}`}>{bookmark.url}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {presets.map(p => (
                <button
                  key={p.label}
                  onClick={() => setMinutes(p.mins)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    minutes === p.mins 
                      ? (isNeo ? 'bg-neo-blue border-2 border-black -translate-x-1 -translate-y-1 shadow-[4px_4px_0_0_#000]' : 'bg-white/20 text-white')
                      : (isNeo ? 'bg-white border-2 border-black hover:bg-black/5 text-black' : 'bg-white/5 text-white/50 hover:bg-white/10')
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${isNeo ? 'text-black' : 'text-white/40'}`}>Custom Minutes</label>
              <input 
                type="number" 
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                className={`w-full p-4 rounded-xl transition-all focus:outline-none ${
                  isNeo ? 'neo-card bg-white text-black' : 'bg-white/5 border border-white/10 text-white'
                }`}
              />
            </div>

            <button 
              onClick={() => {
                onSchedule(bookmark.id, minutes);
                onClose();
              }}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                isNeo ? 'neo-button bg-neo-yellow' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
              }`}
            >
              Set Reminder
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ScheduleModal;
