import React, { useState, useEffect } from 'react';
import { LayoutGrid, List, Settings, Calendar, Search, Trash2, CheckCircle, Clock, ExternalLink, Moon, Sun, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStorage, setStorage } from './utils/storage';
import ScheduleModal from './components/ScheduleModal';

const BookmarkCard = ({ bookmark, theme, onDelete, onMarkRead, onSchedule }) => {
  const isNeo = theme === 'neo';
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className={`p-6 flex flex-col gap-4 transition-all h-full ${isNeo ? 'neo-card rounded-none' : 'glass-card rounded-2xl'}`}
    >
      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${isNeo ? 'bg-neo-blue border-2 border-black shadow-[4px_4px_0_0_#000]' : 'bg-white/10 text-white'}`}>
          {bookmark.title.charAt(0)}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${isNeo ? 'bg-neo-yellow border-2 border-black' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}`}>
            {bookmark.category}
          </span>
          {bookmark.isScheduled && (
            <span className={`flex items-center gap-1 text-[10px] font-bold uppercase ${isNeo ? 'text-black' : 'text-pink-400'}`}>
              <Clock size={10} /> Scheduled
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className={`font-bold mb-1 line-clamp-2 leading-tight ${isNeo ? 'text-black' : 'text-white'}`}>{bookmark.title}</h3>
        <p className={`text-xs line-clamp-1 opacity-50 ${isNeo ? 'text-black' : 'text-white'}`}>{bookmark.url}</p>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-black/10">
        <button 
          onClick={() => onSchedule(bookmark)}
          className={`p-2 rounded-lg transition-colors ${isNeo ? 'hover:bg-neo-pink border-2 border-transparent hover:border-black' : 'hover:bg-white/10 text-white/60'}`}
        >
          <Clock size={18} />
        </button>
        <button 
          onClick={() => onMarkRead(bookmark.id)}
          className={`p-2 rounded-lg transition-colors ${isNeo ? 'hover:bg-neo-green border-2 border-transparent hover:border-black' : 'hover:bg-white/10 text-white/60'}`}
        >
          <CheckCircle size={18} className={bookmark.unread ? '' : 'text-green-400'} />
        </button>
        <a 
          href={bookmark.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`p-2 rounded-lg transition-colors ${isNeo ? 'hover:bg-neo-blue border-2 border-transparent hover:border-black' : 'hover:bg-white/10 text-white/60'}`}
        >
          <ExternalLink size={18} />
        </a>
        <button 
          onClick={() => onDelete(bookmark.id)}
          className={`p-2 rounded-lg ml-auto transition-colors ${isNeo ? 'hover:bg-red-400 border-2 border-transparent hover:border-black' : 'hover:bg-red-500/20 text-red-400'}`}
        >
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

  const categories = ['All', 'Recent', 'Scheduled', 'Learning', 'Development', 'News', 'Entertainment', 'Shopping', 'Work', 'Research', 'Social'];

  useEffect(() => {
    loadBookmarks();
    
    const checkScheduled = async () => {
      const alarms = await chrome.alarms.getAll();
      const alarmNames = alarms.map(a => a.name);
      setBookmarks(prev => prev.map(bm => ({
        ...bm,
        isScheduled: alarmNames.includes(bm.id)
      })));
    };
    
    checkScheduled();
    const interval = setInterval(checkScheduled, 10000);
    
    const handleStorageChange = (changes) => {
      if (changes.bookmarks) {
        setBookmarks(changes.bookmarks.newValue);
        checkScheduled();
      }
    };
    
    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const loadBookmarks = async () => {
    const data = await getStorage(['bookmarks']);
    if (data.bookmarks) {
      setBookmarks(data.bookmarks);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'glass' ? 'neo' : 'glass');
  };

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
    // Force immediate UI update
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
    <div className={`min-h-screen w-full transition-all duration-700 ${
      isNeo 
        ? 'bg-[#FF69B4] text-black' 
        : 'bg-[#0F172A] text-white overflow-x-hidden'
    }`}>
      {/* Background Polish for Glass */}
      {!isNeo && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[120px] rounded-full" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-500/10 blur-[100px] rounded-full" />
        </div>
      )}

      <div className="flex min-h-screen relative z-10">
        {/* Sidebar */}
        <aside className={`w-72 p-8 flex flex-col gap-10 sticky top-0 h-screen ${
          isNeo 
            ? 'neo-card m-4 rounded-none' 
            : 'glass border-r border-white/5 bg-white/[0.02]'
        }`}>
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 90 }}
              className={`p-3 rounded-2xl ${isNeo ? 'bg-neo-yellow border-2 border-black shadow-[4px_4px_0_0_#000]' : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20'}`}
            >
              <LayoutGrid size={28} color={isNeo ? 'black' : 'white'} />
            </motion.div>
            <h1 className="text-2xl font-black tracking-tight">MarkDrop</h1>
          </div>

          <nav className="flex flex-col gap-1 overflow-y-auto pr-2 custom-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl font-bold transition-all duration-300 ${
                  activeCategory === cat 
                    ? (isNeo ? 'bg-neo-blue border-2 border-black -translate-x-1 -translate-y-1 shadow-[4px_4px_0_0_#000]' : 'bg-white/10 text-white shadow-xl border border-white/10')
                    : (isNeo ? 'hover:bg-black/5 text-black/60 hover:text-black' : 'text-white/40 hover:bg-white/5 hover:text-white')
                }`}
              >
                <span>{cat}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-4">
            <button 
              onClick={toggleTheme}
              className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                isNeo ? 'neo-button bg-neo-yellow' : 'glass-card hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              {isNeo ? <Sun size={18} /> : <Moon size={18} />}
              {isNeo ? 'Neo Mode' : 'Glass Mode'}
            </button>
            <button className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-bold opacity-60 hover:opacity-100 transition-opacity`}>
              <Settings size={18} /> Settings
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-12 overflow-y-auto max-w-[1600px] mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
            <div className={`relative flex-1 w-full max-w-2xl group transition-all ${
              isNeo 
                ? 'neo-card flex items-center px-6 py-4' 
                : 'glass flex items-center px-6 py-4 rounded-[2rem] border border-white/5 bg-white/[0.03] focus-within:bg-white/[0.08] focus-within:border-white/20'
            }`}>
              <Search size={22} className={isNeo ? 'text-black' : 'text-white/30 group-focus-within:text-white/60 transition-colors'} />
              <input 
                type="text" 
                placeholder="Search your knowledge..."
                className={`bg-transparent border-none focus:outline-none px-5 w-full text-lg font-medium ${isNeo ? 'placeholder-black/40' : 'placeholder-white/20 text-white'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-4 rounded-[1.25rem] transition-all ${viewMode === 'grid' ? (isNeo ? 'neo-button bg-neo-blue' : 'bg-white/10 text-white border border-white/20') : (isNeo ? 'neo-card bg-white' : 'glass text-white/30 border border-white/5')}`}
              >
                <LayoutGrid size={24} />
              </button>
              <button 
                onClick={() => setViewMode('grouped')}
                className={`p-4 rounded-[1.25rem] transition-all ${viewMode === 'grouped' ? (isNeo ? 'neo-button bg-neo-blue' : 'bg-white/10 text-white border border-white/20') : (isNeo ? 'neo-card bg-white' : 'glass text-white/30 border border-white/5')}`}
              >
                <Layers size={24} />
              </button>
            </div>
          </header>

          <AnimatePresence mode="popLayout">
            {viewMode === 'grid' ? (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {filteredBookmarks.map(bm => (
                  <BookmarkCard 
                    key={bm.id} 
                    bookmark={bm} 
                    theme={theme}
                    onDelete={handleDelete}
                    onMarkRead={handleMarkRead}
                    onSchedule={handleScheduleClick}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div layout className="flex flex-col gap-20">
                {categories.filter(c => !['All', 'Recent', 'Scheduled'].includes(c)).map(cat => {
                  const catBookmarks = filteredBookmarks.filter(bm => bm.category === cat);
                  if (catBookmarks.length === 0) return null;
                  return (
                    <div key={cat} className="flex flex-col gap-8">
                      <div className="flex items-end gap-4">
                        <h2 className={`text-4xl font-black tracking-tighter ${isNeo ? 'text-black' : 'text-white'}`}>
                          {cat}
                        </h2>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full mb-2 ${isNeo ? 'bg-black text-white' : 'bg-white/10 text-white/40'}`}>
                          {catBookmarks.length}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {catBookmarks.map(bm => (
                          <BookmarkCard 
                            key={bm.id} 
                            bookmark={bm} 
                            theme={theme}
                            onDelete={handleDelete}
                            onMarkRead={handleMarkRead}
                            onSchedule={handleScheduleClick}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {filteredBookmarks.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`col-span-full py-32 text-center ${isNeo ? 'text-black' : 'text-white/20'}`}
              >
                <div className="text-8xl mb-6 grayscale opacity-50">📭</div>
                <h2 className="text-3xl font-black mb-2">No links found here</h2>
                <p className="text-lg font-medium opacity-60">Try searching for something else or check another category.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <ScheduleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bookmark={selectedBookmark}
        theme={theme}
        onSchedule={onSchedule}
      />
    </div>
  );
};

export default App;
