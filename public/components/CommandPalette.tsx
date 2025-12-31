
import React, { useState, useEffect, useRef } from 'react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  isDarkMode: boolean;
  navStructure?: Record<string, { id: string; label: string; icon: string }[]>;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate, isDarkMode, navStructure }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  // Dynamically flatten all modules but keep track of order for grouping
  const commands = React.useMemo(() => {
    if (navStructure) {
      return Object.entries(navStructure).flatMap(([category, items]) => 
        items.map(item => ({
          id: item.id,
          label: item.label,
          icon: item.icon,
          category: category
        }))
      );
    }
    return [];
  }, [navStructure]);

  const filteredCommands = commands.filter(c => 
    c.label.toLowerCase().includes(query.toLowerCase()) || 
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  // Show "Global Search" option if typing but no direct match found
  const showGlobalSearchOption = query.length > 2 && filteredCommands.length < 3;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const totalItems = filteredCommands.length + (showGlobalSearchOption ? 1 : 0);
      setSelectedIndex(prev => {
        const next = (prev + 1) % totalItems;
        scrollToItem(next);
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const totalItems = filteredCommands.length + (showGlobalSearchOption ? 1 : 0);
      setSelectedIndex(prev => {
        const next = (prev - 1 + totalItems) % totalItems;
        scrollToItem(next);
        return next;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex < filteredCommands.length) {
        onNavigate(filteredCommands[selectedIndex].id);
        onClose();
      } else if (showGlobalSearchOption) {
        sessionStorage.setItem('pomelli_pending_search', query);
        onNavigate('recon'); 
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const scrollToItem = (index: number) => {
    const item = listRef.current?.children[index] as HTMLElement;
    if (item) {
      item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  };

  // Helper to render category headers
  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'OPERATE': return 'text-indigo-500 border-indigo-500/30 bg-indigo-500/10';
      case 'CREATE': return 'text-rose-500 border-rose-500/30 bg-rose-500/10';
      case 'SELL': return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10';
      case 'CONTROL': return 'text-amber-500 border-amber-500/30 bg-amber-500/10';
      default: return 'text-slate-500 border-slate-500/30 bg-slate-500/10';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[10vh] px-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200" onClick={(e) => { if(e.target === e.currentTarget) onClose(); }}>
      <div 
        className={`w-full max-w-3xl rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden border animate-in slide-in-from-top-4 duration-300 flex flex-col max-h-[70vh] ${
          isDarkMode ? 'bg-[#0f172a] border-slate-800 shadow-indigo-500/10' : 'bg-white border-slate-200'
        }`}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Header */}
        <div className="p-7 border-b border-white/5 flex items-center gap-5 shrink-0">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            ref={inputRef}
            type="text"
            placeholder="Search Modules (e.g., 'Recon', 'Veo', 'Proposal')..."
            className={`flex-1 bg-transparent outline-none text-xl font-black italic uppercase tracking-tight placeholder:text-slate-600 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            autoFocus
          />
          <div className="flex gap-2">
             <button 
               onClick={onClose}
               className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase text-slate-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
             >
               ESC
             </button>
          </div>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto py-2 flex-1 scroll-smooth">
          {filteredCommands.map((cmd, idx) => {
            // Determine if we need a section header
            const prevCmd = filteredCommands[idx - 1];
            const showHeader = !prevCmd || prevCmd.category !== cmd.category;

            return (
              <React.Fragment key={cmd.id}>
                {showHeader && (
                  <div className={`sticky top-0 z-10 px-7 py-2 text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-md border-y border-white/5 ${getCategoryColor(cmd.category)}`}>
                    {cmd.category} Zone
                  </div>
                )}
                <div 
                  onClick={() => { onNavigate(cmd.id); onClose(); }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-7 py-4 flex items-center justify-between cursor-pointer transition-all border-l-4 ${
                    selectedIndex === idx 
                      ? (isDarkMode ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500' : 'bg-indigo-50 text-indigo-600 border-indigo-600') 
                      : (isDarkMode ? 'text-slate-400 border-transparent hover:bg-white/5' : 'text-slate-600 border-transparent hover:bg-slate-50')
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <span className="text-2xl">{cmd.icon}</span>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.1em]">{cmd.label}</p>
                      <p className="text-[8px] font-bold opacity-50 uppercase tracking-widest mt-0.5">{cmd.category} Module</p>
                    </div>
                  </div>
                  {selectedIndex === idx && (
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] animate-pulse">Engage</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}

          {showGlobalSearchOption && (
            <div 
              onClick={() => {
                sessionStorage.setItem('pomelli_pending_search', query);
                onNavigate('recon');
                onClose();
              }}
              onMouseEnter={() => setSelectedIndex(filteredCommands.length)}
              className={`px-7 py-5 flex items-center justify-between cursor-pointer transition-all border-t border-white/5 ${
                selectedIndex === filteredCommands.length 
                  ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600') 
                  : (isDarkMode ? 'text-emerald-500/40' : 'text-emerald-600/40')
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${selectedIndex === filteredCommands.length ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-white/5 border-white/5'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest italic">Deep Web Discovery: "{query}"</p>
                  <p className="text-[8px] font-black opacity-60 uppercase tracking-widest mt-1">Grounding engine v3.1 active</p>
                </div>
              </div>
              {selectedIndex === filteredCommands.length && (
                <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-white px-3 py-1 rounded-full shadow-lg">Launch Sweep</span>
              )}
            </div>
          )}

          {filteredCommands.length === 0 && !showGlobalSearchOption && (
            <div className="p-20 text-center opacity-30">
              <p className="text-sm font-black uppercase italic tracking-tighter">No Module Found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-5 border-t border-white/5 flex items-center justify-between transition-colors shrink-0 ${isDarkMode ? 'bg-[#020617] text-slate-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
          <div className="flex gap-6">
            <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><kbd className="bg-slate-800 text-white px-1.5 py-0.5 rounded text-[8px] border border-white/10 shadow-lg">↑↓</kbd> Select</span>
            <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><kbd className="bg-slate-800 text-white px-1.5 py-0.5 rounded text-[8px] border border-white/10 shadow-lg">ENTER</kbd> Open</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
            <span className="text-[8px] font-black italic uppercase tracking-tighter">System {commands.length} Nodes Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
