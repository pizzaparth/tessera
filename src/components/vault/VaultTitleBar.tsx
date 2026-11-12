import React from 'react';
import { Link } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { GitBranch, FileText, Columns, Sparkles, Plus, RotateCcw, Layers, ArrowLeft, Search } from 'lucide-react';
import { MOD } from './shortcuts';

const tabClass = (active: boolean) =>
  `flex items-center gap-1.5 px-3 h-8 text-xs whitespace-nowrap transition-colors border-b-2 font-medium ${
    active
      ? 'bg-[#121212] text-white border-[#9d4edd]'
      : 'text-[#949494] hover:text-white hover:bg-[#0f0f0f] border-transparent'
  }`;

export const VaultTitleBar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    selectedNode,
    isAIOpen,
    toggleAI,
    openCreateNoteModal,
    openResetVaultModal,
    openQuickSwitcher,
  } = useWorkspace();

  return (
    <header className="h-9 bg-black border-b border-[#1c1c1c] flex items-center justify-between gap-2 px-3 select-none flex-shrink-0 z-40 text-xs">
      {/* Left: window dots, exit, vault name */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 mr-1" aria-hidden="true">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
        </div>

        <Link
          to="/"
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-[#949494] hover:text-white hover:bg-[#181818] transition border border-[#222222]"
          title="Exit demo and return to website"
        >
          <ArrowLeft className="w-3 h-3" />
          <span className="hidden sm:inline">Website</span>
        </Link>

        <div className="hidden md:flex items-center gap-1.5 text-white">
          <Layers className="w-3.5 h-3.5 text-[#9d4edd]" />
          <span className="text-[11px] font-semibold">Brain Vault</span>
        </div>
      </div>

      {/* Middle: tabs */}
      <nav className="flex items-center gap-0.5 flex-1 min-w-0 max-w-xl overflow-x-auto no-scrollbar" aria-label="Open views">
        <button
          onClick={() => setActiveView('graph')}
          className={tabClass(activeView === 'graph')}
          aria-current={activeView === 'graph' ? 'page' : undefined}
          title={`Graph view (${MOD} G)`}
        >
          <GitBranch className="w-3.5 h-3.5 text-[#9d4edd]" />
          <span>Graph</span>
        </button>

        {selectedNode && (
          <button
            onClick={() => setActiveView('note')}
            className={`${tabClass(activeView === 'note')} min-w-0 max-w-[220px]`}
            aria-current={activeView === 'note' ? 'page' : undefined}
            title={selectedNode.label}
          >
            <FileText className="w-3.5 h-3.5 text-[#949494] flex-shrink-0" />
            <span className="truncate">{selectedNode.label}</span>
          </button>
        )}

        <button
          onClick={openCreateNoteModal}
          className="p-1.5 ml-0.5 rounded text-[#949494] hover:text-white hover:bg-[#181818] transition flex-shrink-0"
          title={`New note (${MOD} Shift N)`}
          aria-label="New note"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </nav>

      {/* Right: search, layout, AI */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={openQuickSwitcher}
          className="flex items-center gap-2 h-6 pl-2 pr-1 rounded-md border border-[#222222] bg-[#0a0a0a] text-[#8a8a8a] hover:text-white hover:border-[#333333] transition"
          title={`Search notes (${MOD} K)`}
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden lg:inline text-[11px] pr-4">Search notes</span>
          <kbd className="vault-kbd hidden sm:inline-flex">{MOD} K</kbd>
        </button>

        <button
          onClick={() => setActiveView(activeView === 'split' ? 'graph' : 'split')}
          className={`hidden lg:flex px-2 py-1 rounded items-center gap-1 transition text-xs font-medium ${
            activeView === 'split' ? 'bg-[#181818] text-[#b57aed]' : 'text-[#949494] hover:text-white hover:bg-[#121212]'
          }`}
          title={`Split view: graph + note (${MOD} Shift S)`}
          aria-pressed={activeView === 'split'}
        >
          <Columns className="w-3.5 h-3.5" />
          <span className="hidden xl:inline text-[11px]">Split</span>
        </button>

        <button
          onClick={openResetVaultModal}
          className="p-1.5 text-[#949494] hover:text-white hover:bg-[#121212] rounded transition"
          title="Reset vault to default"
          aria-label="Reset vault"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={toggleAI}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition ${
            isAIOpen
              ? 'bg-[#181818] border-[#9d4edd]/50 text-white shadow-[0_0_12px_rgba(157,78,221,0.25)]'
              : 'bg-[#0a0a0a] border-[#1e1e1e] text-[#949494] hover:text-white hover:border-[#333333]'
          }`}
          title={`AI assistant (${MOD} J)`}
          aria-pressed={isAIOpen}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#b57aed]" />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>
      </div>
    </header>
  );
};
