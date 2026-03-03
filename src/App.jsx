import React, { useState, useEffect } from 'react';
import { LayoutGrid, List, Settings, Calendar, Search, Trash2, CheckCircle, Clock, ExternalLink, Moon, Sun, Layers, Menu, X as CloseIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStorage, setStorage } from './utils/storage';
import ScheduleModal from './components/ScheduleModal';

const BookmarkCard = ({ bookmark, theme, onDelete, onMarkRead, onSchedule }) => {
  const isNeo = theme === 'neo';
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group p-5 flex flex-col gap-4 h-full ${isNeo ? 'neo-card' : 'glass-card rounded-[1.5rem]'}`}
    >
      <div className="flex justify-between items-start gap-3">
        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${isNeo ? 'bg-neo-blue border-2 border-black shadow-[3px_3px_0_0_#000]' : 'bg-white/10 text-white shadow-inner'}`}>
          {bookmark.title.charAt(0)}
        </div>
        <div className="flex flex-col items-end gap-2 overflow-hidden">
          <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg tracking-wider truncate max-w-full ${isNeo ? 'bg-neo-yellow border-2 border-black' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}`}>
            {bookmark.category}
          </span>
          {bookmark.isScheduled && (
            <span className={`flex items-center gap-1 text-[9px] font-black uppercase ${isNeo ? 'text-black' : 'text-pink-400'}`}>
              <Clock size={10} strokeWidth={3} /> Scheduled
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <h3 className={`font-black text-base mb-1 line-clamp-2 leading-tight ${isNeo ? 'text-black' : 'text-white'}`}>{bookmark.title}</h3>
        <p className={`text-[11px] font-medium line-clamp-1 opacity-40 ${isNeo ? 'text-black' : 'text-white'}`}>{bookmark.url}</p>
      </div>

      <div className="flex gap-1.5 mt-auto pt-4 border-t border-white/5 group-hover:border-white/10 transition-colors">
        <button onClick={() => onSchedule(bookmark)} className={`p-2 rounded-xl transition-all ${isNeo ? 'hover:bg-neo-pink border-2 border-transparent hover:border-black' : 'hover:bg-white/10 text-white/50 hover:text-white'}`}>
          <Clock size={16} />
        </button>
        <button onClick={() => onMarkRead(bookmark.id)} className={`p-2 rounded-xl transition-all ${isNeo ? 'hover:bg-neo-green border-2 border-transparent hover:border-black' : 'hover:bg-white/10 text-white/50 hover:text-white'}`}>
          <CheckCircle size={16} className={bookmark.unread ? '' : 'text-green-400'} />
        </button>
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-xl transition-all ${isNeo ? 'hover:bg-neo-blue border-2 border-transparent hover:border-black' : 'hover:bg-white/10 text-white/50 hover:text-white'}`}>
          <ExternalLink size={16} />
        </a>
        <button onClick={() => onDelete(bookmark.id)} className={`p-2 rounded-xl ml-auto transition-all ${isNeo ? 'hover:bg-red-400 border-2 border-transparent hover:border-black' : 'hover:bg-red-500/20 text-red-400'}`}>
          <Trash2 size={16} />
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
    <div className={`flex min-h-screen w-full transition-all duration-700 ${isNeo ? 'bg-[#FF69B4]' : 'bg-[#0F172A]'}`}>
      {/* Dynamic Background */}
      {!isNeo && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
        </div>
      )}

      {/* Sidebar - Desktop */}
      <aside className={`hidden lg:flex w-72 h-screen sticky top-0 flex-col p-8 gap-8 ${isNeo ? 'neo-card m-4 rounded-none' : 'glass border-r border-white/5'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${isNeo ? 'bg-neo-yellow border-2 border-black shadow-[4px_4px_0_0_#000]' : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20'}`}>
            <LayoutGrid size={24} color={isNeo ? 'black' : 'white'} strokeWidth={3} />
          </div>
          <h1 className={`text-2xl font-black tracking-tighter ${isNeo ? 'text-black' : 'text-white'}`}>MarkDrop</h1>
        </div>

        <nav className="flex-1 overflow-y-auto pr-2 flex flex-col gap-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 ${
                activeCategory === cat 
                  ? (isNeo ? 'bg-neo-blue border-2 border-black shadow-[4px_4px_0_0_#000]' : 'bg-white/10 text-white shadow-lg border border-white/10')
                  : (isNeo ? 'hover:bg-black/5 text-black/60' : 'text-white/30 hover:bg-white/5 hover:text-white')
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <button onClick={toggleTheme} className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${isNeo ? 'neo-button bg-neo-yellow' : 'glass-card text-white hover:bg-white/10'}`}>
            {isNeo ? <Sun size={14} /> : <Moon size={14} />} {isNeo ? 'Light Theme' : 'Dark Theme'}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/60 lg:hidden" />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className={`fixed left-0 top-0 bottom-0 z-50 w-72 p-8 flex flex-col gap-8 ${isNeo ? 'bg-white border-r-4 border-black' : 'glass border-r border-white/10'}`}>
              <div className="flex justify-between items-center">
                <h1 className={`text-2xl font-black tracking-tighter ${isNeo ? 'text-black' : 'text-white'}`}>MarkDrop</h1>
                <button onClick={() => setIsSidebarOpen(false)} className={isNeo ? 'text-black' : 'text-white'}><CloseIcon size={24} /></button>
              </div>
              <nav className="flex-1 overflow-y-auto flex flex-col gap-1">
                {categories.map(cat => (
                  <button key={cat} onClick={() => { setActiveCategory(cat); setIsSidebarOpen(false); }} className={`flex items-center gap-3 px-5 py-3 rounded-2xl font-black text-sm transition-all ${activeCategory === cat ? (isNeo ? 'bg-neo-blue border-2 border-black shadow-[4px_4px_0_0_#000]' : 'bg-white/10 text-white') : (isNeo ? 'text-black/60' : 'text-white/40')}`}>
                    {cat}
                  </button>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-h-screen flex flex-col">
        <header className={`sticky top-0 z-30 p-4 lg:p-8 flex items-center justify-between gap-4 ${!isNeo && 'bg-[#0F172A]/80 backdrop-blur-md'}`}>
          <button onClick={() => setIsSidebarOpen(true)} className={`lg:hidden p-3 rounded-xl ${isNeo ? 'neo-card bg-white' : 'glass text-white'}`}>
            <Menu size={20} />
          </button>

          <div className={`relative flex-1 max-w-2xl flex items-center px-6 py-3.5 transition-all ${isNeo ? 'neo-card' : 'glass rounded-[1.5rem] border-white/10 hover:border-white/20'}`}>
            <Search size={20} className={isNeo ? 'text-black' : 'text-white/20'} />
            <input 
              type="text" 
              placeholder="Search knowledge..."
              className={`bg-transparent border-none focus:outline-none px-4 w-full font-bold ${isNeo ? 'placeholder-black/40 text-black' : 'placeholder-white/20 text-white'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setViewMode('grid')} className={`p-3.5 rounded-xl transition-all ${viewMode === 'grid' ? (isNeo ? 'neo-button bg-neo-blue' : 'bg-white/10 text-white border border-white/20') : (isNeo ? 'neo-card bg-white' : 'glass text-white/30 border border-white/5')}`}><LayoutGrid size={20} /></button>
            <button onClick={() => setViewMode('grouped')} className={`p-3.5 rounded-xl transition-all ${viewMode === 'grouped' ? (isNeo ? 'neo-button bg-neo-blue' : 'bg-white/10 text-white border border-white/20') : (isNeo ? 'neo-card bg-white' : 'glass text-white/30 border border-white/5')}`}><Layers size={20} /></button>
          </div>
        </header>

        <section className="flex-1 p-4 lg:p-12 lg:pt-4">
          <AnimatePresence mode="popLayout">
            {viewMode === 'grid' ? (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6 lg:gap-8">
                {filteredBookmarks.map(bm => (
                  <BookmarkCard key={bm.id} bookmark={bm} theme={theme} onDelete={handleDelete} onMarkRead={handleMarkRead} onSchedule={handleScheduleClick} />
                ))}
              </motion.div>
            ) : (
              <motion.div layout className="flex flex-col gap-16 lg:gap-24">
                {categories.filter(c => !['All', 'Recent', 'Scheduled'].includes(c)).map(cat => {
                  const catBookmarks = filteredBookmarks.filter(bm => bm.category === cat);
                  if (catBookmarks.length === 0) return null;
                  return (
                    <div key={cat} className="flex flex-col gap-8">
                      <div className="flex items-center gap-4">
                        <h2 className={`text-3xl lg:text-5xl font-black tracking-tighter ${isNeo ? 'text-black' : 'text-white'}`}>{cat}</h2>
                        <span className={`text-xs font-black px-3 py-1.5 rounded-xl ${isNeo ? 'bg-black text-white' : 'bg-white/10 text-white/40'}`}>{catBookmarks.length}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6 lg:gap-8">
                        {catBookmarks.map(bm => (
                          <BookmarkCard key={bm.id} bookmark={bm} theme={theme} onDelete={handleDelete} onMarkRead={handleMarkRead} onSchedule={handleScheduleClick} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {filteredBookmarks.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex flex-col items-center justify-center py-40 text-center ${isNeo ? 'text-black' : 'text-white/20'}`}>
                <div className="text-8xl mb-6 opacity-40">🛸</div>
                <h2 className="text-3xl font-black mb-2">Workspace empty</h2>
                <p className="text-lg font-medium opacity-60">Try a different filter or search term.</p>
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
