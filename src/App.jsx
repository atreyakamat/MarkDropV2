import React, { useState, useEffect } from 'react';
import { LayoutGrid, List, Settings, Calendar, Search, Trash2, CheckCircle, Clock, ExternalLink, Moon, Sun, Layers, Menu, X as CloseIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStorage, setStorage } from './utils/storage';
import ScheduleModal from './components/ScheduleModal';

const GlassBackground = () => (
  <div className="glass-canvas">
    {[...Array(6)].map((_, i) => (
      <div 
        key={i}
        className="glass-particle"
        style={{
          width: `${Math.random() * 400 + 200}px`,
          height: `${Math.random() * 400 + 200}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${i * -5}s`,
          animationDuration: `${Math.random() * 10 + 15}s`,
          opacity: 0.15
        }}
      />
    ))}
    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
  </div>
);

const BookmarkCard = ({ bookmark, theme, onDelete, onMarkRead, onSchedule }) => {
  const isNeo = theme === 'neo';
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group p-6 flex flex-col gap-4 h-full relative ${isNeo ? 'neo-card' : 'glass-card rounded-[2rem]'}`}
    >
      {!isNeo && <div className="glass-noise" />}
      
      {/* Refraction Glare */}
      {!isNeo && (
        <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full group-hover:translate-y-full transition-all duration-1000 pointer-events-none" />
      )}

      <div className="flex justify-between items-start gap-4 relative z-10">
        <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${isNeo ? 'bg-neo-blue border-3 border-black shadow-[4px_4px_0_0_#000]' : 'bg-white/10 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.1)] border border-white/10'}`}>
          {bookmark.title.charAt(0)}
        </div>
        <div className="flex flex-col items-end gap-2 overflow-hidden">
          <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-xl tracking-widest truncate max-w-full ${isNeo ? 'bg-neo-yellow border-3 border-black' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 backdrop-blur-md'}`}>
            {bookmark.category}
          </span>
          {bookmark.isScheduled && (
            <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${isNeo ? 'text-black' : 'text-pink-400'}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              Scheduled
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden relative z-10">
        <h3 className={`font-black text-lg mb-1.5 line-clamp-2 leading-tight tracking-tight ${isNeo ? 'text-black' : 'text-white/90 group-hover:text-white transition-colors'}`}>{bookmark.title}</h3>
        <p className={`text-[11px] font-bold line-clamp-1 opacity-40 ${isNeo ? 'text-black' : 'text-white'}`}>{bookmark.url}</p>
      </div>

      <div className="flex gap-2 mt-auto pt-5 border-t border-white/5 relative z-10">
        <button onClick={() => onSchedule(bookmark)} className={`p-2.5 rounded-2xl transition-all ${isNeo ? 'hover:bg-neo-pink border-3 border-transparent hover:border-black' : 'hover:bg-white/10 text-white/40 hover:text-white'}`}>
          <Clock size={18} />
        </button>
        <button onClick={() => onMarkRead(bookmark.id)} className={`p-2.5 rounded-2xl transition-all ${isNeo ? 'hover:bg-neo-green border-3 border-transparent hover:border-black' : 'hover:bg-white/10 text-white/40 hover:text-white'}`}>
          <CheckCircle size={18} className={bookmark.unread ? '' : 'text-green-400'} />
        </button>
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className={`p-2.5 rounded-2xl transition-all ${isNeo ? 'hover:bg-neo-blue border-3 border-transparent hover:border-black' : 'hover:bg-white/10 text-white/40 hover:text-white'}`}>
          <ExternalLink size={18} />
        </a>
        <button onClick={() => onDelete(bookmark.id)} className={`p-2.5 rounded-2xl ml-auto transition-all ${isNeo ? 'hover:bg-red-400 border-3 border-transparent hover:border-black' : 'hover:bg-red-500/20 text-red-400'}`}>
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
};

const App = () => {
  const [theme, setTheme] = useState('glass');
  const [bookmarks, setBookmarks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categories = ['All', 'Recent', 'Scheduled', 'Learning', 'Development', 'News', 'Entertainment', 'Shopping', 'Work', 'Research', 'Social'];

  useEffect(() => {
    loadBookmarks();
    const checkScheduled = async () => {
      const alarms = await chrome.alarms.getAll();
      const alarmNames = alarms.map(a => a.name);
      setBookmarks(prev => prev.map(bm => ({ ...bm, isScheduled: alarmNames.includes(bm.id) })));
    };
    checkScheduled();
    const handleStorageChange = (changes) => {
      if (changes.bookmarks) {
        setBookmarks(changes.bookmarks.newValue);
        checkScheduled();
      }
    };
    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  const loadBookmarks = async () => {
    const data = await getStorage(['bookmarks']);
    if (data.bookmarks) setBookmarks(data.bookmarks);
  };

  const toggleTheme = () => setTheme(prev => prev === 'glass' ? 'neo' : 'glass');

  const handleDelete = async (id) => {
    const updated = bookmarks.filter(b => b.id !== id);
    setBookmarks(updated);
    await setStorage({ bookmarks: updated });
    chrome.bookmarks.remove(id);
    chrome.alarms.clear(id);
  };

  const handleMarkRead = async (id) => {
    const updated = bookmarks.map(b => b.id === id ? { ...b, unread: !b.unread } : b);
    setBookmarks(updated);
    await setStorage({ bookmarks: updated });
  };

  const handleScheduleClick = (bookmark) => {
    setSelectedBookmark(bookmark);
    setIsModalOpen(true);
  };

  const onSchedule = async (id, minutes) => {
    await chrome.alarms.create(id, { delayInMinutes: minutes });
    setBookmarks(prev => prev.map(bm => bm.id === id ? { ...bm, isScheduled: true } : bm));
  };

  const filteredBookmarks = bookmarks.filter(bm => {
    const matchesSearch = bm.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         bm.url.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Recent') {
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      return bm.dateAdded > oneDayAgo;
    }
    if (activeCategory === 'Scheduled') return bm.isScheduled;
    return bm.category === activeCategory;
  });

  const isNeo = theme === 'neo';

  return (
    <div className={`flex min-h-screen w-full transition-all duration-1000 ${isNeo ? 'bg-[#FF69B4]' : 'bg-[#050810]'}`}>
      {!isNeo && <GlassBackground />}

      <aside className={`hidden lg:flex w-80 h-screen sticky top-0 flex-col p-10 gap-10 ${isNeo ? 'neo-card m-4 rounded-none' : 'glass border-r border-white/5 bg-white/[0.01]'}`}>
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-[1.5rem] ${isNeo ? 'bg-neo-yellow border-4 border-black shadow-[6px_6px_0_0_#000]' : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/40'}`}>
            <LayoutGrid size={28} color={isNeo ? 'black' : 'white'} strokeWidth={3} />
          </div>
          <h1 className={`text-3xl font-black tracking-tighter ${isNeo ? 'text-black' : 'text-white'}`}>MarkDrop</h1>
        </div>

        <nav className="flex-1 overflow-y-auto pr-4 flex flex-col gap-2 custom-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all duration-500 ${
                activeCategory === cat 
                  ? (isNeo ? 'bg-neo-blue border-4 border-black shadow-[6px_6px_0_0_#000]' : 'bg-white/10 text-white shadow-2xl border border-white/10 scale-105')
                  : (isNeo ? 'hover:bg-black/5 text-black/60' : 'text-white/20 hover:bg-white/5 hover:text-white')
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>

        <button onClick={toggleTheme} className={`flex items-center justify-center gap-4 px-8 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] transition-all ${isNeo ? 'neo-button bg-neo-yellow' : 'glass-card text-white hover:bg-white/10'}`}>
          {isNeo ? <Sun size={16} /> : <Moon size={16} />} {isNeo ? 'NEO' : 'GLASS'}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen flex flex-col relative z-10">
        <header className={`sticky top-0 z-30 p-6 lg:p-12 flex items-center justify-between gap-6 ${!isNeo && 'bg-[#050810]/40 backdrop-blur-xl'}`}>
          <button onClick={() => setIsSidebarOpen(true)} className={`lg:hidden p-4 rounded-2xl ${isNeo ? 'neo-card bg-white' : 'glass text-white'}`}>
            <Menu size={24} />
          </button>

          <div className={`relative flex-1 max-w-3xl flex items-center px-8 py-5 transition-all ${isNeo ? 'neo-card' : 'glass rounded-[2rem] border-white/5 hover:border-white/20 bg-white/[0.02]'}`}>
            <Search size={22} className={isNeo ? 'text-black' : 'text-white/20'} />
            <input 
              type="text" 
              placeholder="Search your library..."
              className={`bg-transparent border-none focus:outline-none px-6 w-full text-lg font-black ${isNeo ? 'placeholder-black/40 text-black' : 'placeholder-white/10 text-white'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setViewMode('grid')} className={`p-4 rounded-2xl transition-all ${viewMode === 'grid' ? (isNeo ? 'neo-button bg-neo-blue' : 'bg-white/10 text-white border border-white/20') : (isNeo ? 'neo-card bg-white' : 'glass text-white/20 border border-white/5')}`}><LayoutGrid size={24} /></button>
            <button onClick={() => setViewMode('grouped')} className={`p-4 rounded-2xl transition-all ${viewMode === 'grouped' ? (isNeo ? 'neo-button bg-neo-blue' : 'bg-white/10 text-white border border-white/20') : (isNeo ? 'neo-card bg-white' : 'glass text-white/20 border border-white/5')}`}><Layers size={24} /></button>
          </div>
        </header>

        <section className="flex-1 p-6 lg:p-16 lg:pt-0 pb-24">
          <AnimatePresence mode="popLayout">
            {viewMode === 'grid' ? (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-5 gap-8 lg:gap-10">
                {filteredBookmarks.map(bm => (
                  <BookmarkCard key={bm.id} bookmark={bm} theme={theme} onDelete={handleDelete} onMarkRead={handleMarkRead} onSchedule={handleScheduleClick} />
                ))}
              </motion.div>
            ) : (
              <motion.div layout className="flex flex-col gap-24 lg:gap-32">
                {categories.filter(c => !['All', 'Recent', 'Scheduled'].includes(c)).map(cat => {
                  const catBookmarks = filteredBookmarks.filter(bm => bm.category === cat);
                  if (catBookmarks.length === 0) return null;
                  return (
                    <div key={cat} className="flex flex-col gap-12">
                      <div className="flex items-center gap-6">
                        <h2 className={`text-4xl lg:text-7xl font-black tracking-tighter ${isNeo ? 'text-black' : 'text-white'}`}>{cat}</h2>
                        <span className={`text-sm font-black px-4 py-2 rounded-[1rem] ${isNeo ? 'bg-black text-white' : 'bg-white/5 text-white/40'}`}>{catBookmarks.length}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-5 gap-8 lg:gap-10">
                        {catBookmarks.map(bm => (
                          <BookmarkCard key={bm.id} bookmark={bm} theme={theme} onDelete={handleDelete} onMarkRead={handleMarkRead} onSchedule={handleScheduleClick} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <ScheduleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} bookmark={selectedBookmark} theme={theme} onSchedule={onSchedule} />
    </div>
  );
};

export default App;
