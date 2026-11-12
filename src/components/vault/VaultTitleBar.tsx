import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  GitBranch,
  FileText,
  Columns,
  Sparkles,
  Plus,
  ChevronDown,
  RotateCcw,
  Layers,
} from 'lucide-react';

export const VaultTitleBar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    selectedNode,
    isAIOpen,
    toggleAI,
    openCreateNoteModal,
    openResetVaultModal,
    activeModel,
  } = useWorkspace();

  return (
    <header className="h-9 bg-black border-b border-[#1c1c1c] flex items-center justify-between px-3 select-none flex-shrink-0 z-40 text-xs">
      {/* Left: Window Controls & Vault Switcher */}
      <div className="flex items-center gap-3">
        {/* macOS traffic light window dots */}
        <div className="flex items-center gap-1.5 mr-1">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
        </div>

        {/* Vault Switcher */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-[#181818] cursor-pointer text-white font-medium transition">
          <Layers className="w-3.5 h-3.5 text-[#9d4edd]" />
          <span className="text-[11px] font-semibold text-white">Brain Vault</span>
          <ChevronDown className="w-3 h-3 text-[#949494]" />
        </div>
      </div>

      {/* Middle: Vault Tabs */}
      <div className="flex items-center gap-1 flex-1 max-w-xl mx-4 overflow-x-auto no-scrollbar">
        {/* Tab 1: Graph View */}
        <button
          onClick={() => setActiveView('graph')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-t text-xs transition border-b-2 font-medium ${
            activeView === 'graph'
              ? 'bg-[#121212] text-white border-[#9d4edd]'
              : 'text-[#949494] hover:text-white hover:bg-[#0f0f0f] border-transparent'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5 text-[#9d4edd]" />
          <span>Graph view</span>
        </button>

        {/* Tab 2: Active Note */}
        {selectedNode && (
          <button
            onClick={() => setActiveView('note')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-t text-xs transition border-b-2 font-medium max-w-[200px] truncate ${
              activeView === 'note'
                ? 'bg-[#121212] text-white border-[#9d4edd]'
                : 'text-[#949494] hover:text-white hover:bg-[#0f0f0f] border-transparent'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#949494]" />
            <span className="truncate">{selectedNode.label}.md</span>
          </button>
        )}

        {/* New Tab (+) */}
        <button
          onClick={openCreateNoteModal}
          className="p-1 rounded text-[#949494] hover:text-white hover:bg-[#181818] transition"
          title="New note"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Layout & AI Plugin Controls */}
      <div className="flex items-center gap-1.5">
        {/* Split View Toggle */}
        <button
          onClick={() => setActiveView(activeView === 'split' ? 'graph' : 'split')}
          className={`px-2 py-1 rounded flex items-center gap-1 transition text-xs font-medium ${
            activeView === 'split'
              ? 'bg-[#181818] text-[#9d4edd]'
              : 'text-[#949494] hover:text-white hover:bg-[#121212]'
          }`}
          title="Split View (Graph + Note)"
        >
          <Columns className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[11px]">Split</span>
        </button>

        {/* Reset Vault */}
        <button
          onClick={openResetVaultModal}
          className="p-1.5 text-[#949494] hover:text-white hover:bg-[#121212] rounded transition"
          title="Reset Vault to default"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* AI Plugin Toggle Button */}
        <button
          onClick={toggleAI}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition ${
            isAIOpen
              ? 'bg-[#181818] border-[#9d4edd]/50 text-white shadow-[0_0_12px_rgba(157,78,221,0.25)]'
              : 'bg-[#0a0a0a] border-[#1e1e1e] text-[#949494] hover:text-white hover:border-[#333333]'
          }`}
          title="Toggle AI Knowledge Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#9d4edd]" />
          <span className="hidden sm:inline">AI Assistant</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
        </button>
      </div>
    </header>
  );
};
