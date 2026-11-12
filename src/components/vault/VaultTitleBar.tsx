import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Network, FileText, Columns2, Sparkles, RotateCcw, ArrowLeft, Search, PanelLeft } from 'lucide-react';
import { MOD } from './shortcuts';

type View = 'graph' | 'note' | 'split';

export const VaultTitleBar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    selectedNode,
    isAIOpen,
    toggleAI,
    isSidebarOpen,
    toggleSidebar,
    openResetVaultModal,
    openQuickSwitcher,
  } = useWorkspace();

  const views: { id: View; label: string; icon: typeof Network; shortcut: string; wideOnly?: boolean }[] = [
    { id: 'graph', label: 'Graph', icon: Network, shortcut: `${MOD} G` },
    { id: 'note', label: selectedNode ? selectedNode.label : 'Note', icon: FileText, shortcut: `${MOD} E` },
    { id: 'split', label: 'Split', icon: Columns2, shortcut: `${MOD} Shift S`, wideOnly: true },
  ];

  return (
    <header className="vault-chrome h-12 border-b border-black/5 flex items-center justify-between gap-3 px-3 sm:px-4 flex-shrink-0 z-40">
      {/* Left: window dots, sidebar toggle, back to site */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <div className="hidden sm:flex items-center gap-2 mr-1" aria-hidden="true">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <button
          onClick={toggleSidebar}
          className={`p-1.5 rounded-lg transition-colors ${
            isSidebarOpen ? 'text-black bg-white/70' : 'text-black/50 hover:text-black hover:bg-white/60'
          }`}
          title={`${isSidebarOpen ? 'Hide' : 'Show'} sidebar (${MOD} B)`}
          aria-label="Toggle sidebar"
          aria-pressed={isSidebarOpen}
        >
          <PanelLeft className="w-4 h-4" />
        </button>
        <Link
          to="/"
          className="hidden md:flex items-center gap-1 text-[13px] text-black/55 hover:text-black transition-colors"
          title="Back to the website"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Website
        </Link>
      </div>

      {/* Center: view switcher, styled like the landing page prompt chips */}
      <nav
        className="flex items-center gap-0.5 rounded-full p-1 bg-white/55 ring-1 ring-black/5 min-w-0"
        aria-label="View"
        role="tablist"
      >
        {views.map(({ id, label, icon: Icon, shortcut, wideOnly }) => {
          const active = activeView === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={active}
              onClick={() => setActiveView(id)}
              className={`relative flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium tracking-[-0.01em] transition-colors min-w-0 ${
                active ? 'text-black' : 'text-black/55 hover:text-black'
              } ${wideOnly ? 'hidden lg:flex' : ''} ${id === 'note' ? 'max-w-[220px]' : ''}`}
              title={`${id === 'note' ? 'Note' : label} (${shortcut})`}
            >
              {active && (
                <motion.span
                  layoutId="vault-view-chip"
                  className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(15,10,20,0.15)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative flex items-center gap-1.5 min-w-0">
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{label}</span>
              </span>
            </button>
          );
        })}
      </nav>

      {/* Right: search, reset, AI */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <button
          onClick={openQuickSwitcher}
          className="flex items-center gap-2 h-8 pl-2.5 pr-1.5 rounded-full bg-white/70 ring-1 ring-black/5 text-black/50 hover:text-black hover:bg-white transition-colors"
          title={`Search notes (${MOD} K)`}
          aria-label="Search notes"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden xl:inline text-[13px] pr-6">Search notes</span>
          <kbd className="vault-kbd hidden sm:inline-flex">{MOD} K</kbd>
        </button>
        <button
          onClick={openResetVaultModal}
          className="p-2 rounded-full text-black/45 hover:text-black hover:bg-white/60 transition-colors"
          title="Reset vault to the sample notes"
          aria-label="Reset vault"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={toggleAI}
          className={`atlas-pill atlas-pill-sm ${isAIOpen ? '' : '!bg-white !text-black ring-1 ring-black/10 hover:!bg-[#f6f5f9]'}`}
          title={`Vault AI (${MOD} J)`}
          aria-pressed={isAIOpen}
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Vault AI</span>
        </button>
      </div>
    </header>
  );
};
