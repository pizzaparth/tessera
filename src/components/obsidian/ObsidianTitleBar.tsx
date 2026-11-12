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
  X,
} from 'lucide-react';

export const ObsidianTitleBar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    selectedNode,
    isClaudeOpen,
    toggleClaude,
    createNote,
    resetVault,
  } = useWorkspace();

  return (
    <header className="h-9 bg-obsidian-titlebar border-b border-obsidian-border flex items-center justify-between px-3 select-none flex-shrink-0 z-40 text-xs">
      {/* Left: macOS Window Controls & Vault Switcher */}
      <div className="flex items-center gap-3">
        {/* macOS traffic light window dots */}
        <div className="flex items-center gap-1.5 mr-1">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
        </div>

        {/* Vault Switcher */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-obsidian-hover cursor-pointer text-obsidian-text font-medium transition">
          <span className="text-[11px] font-semibold text-obsidian-text">Brain Vault</span>
          <ChevronDown className="w-3 h-3 text-obsidian-textMuted" />
        </div>
      </div>

      {/* Middle: Obsidian Tabs */}
      <div className="flex items-center gap-1 flex-1 max-w-xl mx-4 overflow-x-auto no-scrollbar">
        {/* Tab 1: Graph View */}
        <button
          onClick={() => setActiveView('graph')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-t-md text-xs transition border-b-2 font-medium ${
            activeView === 'graph'
              ? 'bg-obsidian-activeTab text-obsidian-text border-obsidian-purple'
              : 'text-obsidian-textMuted hover:text-obsidian-text hover:bg-obsidian-surface border-transparent'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5 text-obsidian-purple" />
          <span>Graph view</span>
        </button>

        {/* Tab 2: Active Note */}
        {selectedNode && (
          <button
            onClick={() => setActiveView('note')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-t-md text-xs transition border-b-2 font-medium max-w-[200px] truncate ${
              activeView === 'note'
                ? 'bg-obsidian-activeTab text-obsidian-text border-obsidian-purple'
                : 'text-obsidian-textMuted hover:text-obsidian-text hover:bg-obsidian-surface border-transparent'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-obsidian-textMuted" />
            <span className="truncate">{selectedNode.label}.md</span>
          </button>
        )}

        {/* New Tab (+) */}
        <button
          onClick={() => {
            const title = prompt('Enter title for new note:');
            if (title && title.trim()) {
              createNote(title.trim());
            }
          }}
          className="p-1 rounded text-obsidian-textMuted hover:text-obsidian-text hover:bg-obsidian-surface transition"
          title="New note"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Layout & Claude Plugin Controls */}
      <div className="flex items-center gap-1.5">
        {/* Split View Toggle */}
        <button
          onClick={() => setActiveView(activeView === 'split' ? 'graph' : 'split')}
          className={`px-2 py-1 rounded flex items-center gap-1 transition ${
            activeView === 'split'
              ? 'bg-obsidian-hover text-obsidian-purple'
              : 'text-obsidian-textMuted hover:text-obsidian-text hover:bg-obsidian-surface'
          }`}
          title="Split View (Graph + Note)"
        >
          <Columns className="w-3.5 h-3.5" />
          <span className="text-[11px] hidden sm:inline">Split</span>
        </button>

        {/* Restore Vault Defaults */}
        <button
          onClick={() => {
            if (confirm('Restore sample vault to default notes and graph?')) {
              resetVault();
            }
          }}
          className="p-1.5 text-obsidian-textMuted hover:text-obsidian-text hover:bg-obsidian-surface rounded transition"
          title="Reset Vault"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Claude Assistant Plugin Button */}
        <button
          onClick={toggleClaude}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium border ${
            isClaudeOpen
              ? 'bg-obsidian-claudeBg border-obsidian-claude/40 text-obsidian-claude shadow-sm'
              : 'bg-obsidian-surface border-obsidian-border text-obsidian-textMuted hover:text-obsidian-claude hover:border-obsidian-claude/30'
          }`}
          title="Toggle Claude Plugin Sidebar"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold">Claude</span>
        </button>
      </div>
    </header>
  );
};
