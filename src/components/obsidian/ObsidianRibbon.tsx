import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  Folder,
  Search,
  GitBranch,
  Sparkles,
  Settings,
  Plus,
  Compass,
  BookOpen,
} from 'lucide-react';

export const ObsidianRibbon: React.FC = () => {
  const {
    activeView,
    setActiveView,
    isClaudeOpen,
    toggleClaude,
    isSidebarOpen,
    toggleSidebar,
    createNote,
  } = useWorkspace();

  return (
    <div className="w-10 sm:w-11 bg-obsidian-titlebar border-r border-obsidian-border flex flex-col items-center justify-between py-2 flex-shrink-0 z-30 select-none">
      {/* Top action icons */}
      <div className="flex flex-col items-center gap-1">
        {/* Toggle Vault File Tree */}
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-lg transition ${
            isSidebarOpen
              ? 'text-obsidian-text bg-obsidian-hover'
              : 'text-obsidian-textMuted hover:text-obsidian-text hover:bg-obsidian-hover'
          }`}
          title={isSidebarOpen ? 'Collapse Files sidebar' : 'Expand Files sidebar'}
        >
          <Folder className="w-4 h-4" />
        </button>

        {/* Graph View */}
        <button
          onClick={() => setActiveView('graph')}
          className={`p-2 rounded-lg transition ${
            activeView === 'graph'
              ? 'text-obsidian-purple bg-obsidian-hover'
              : 'text-obsidian-textMuted hover:text-obsidian-text hover:bg-obsidian-hover'
          }`}
          title="Open Graph View"
        >
          <GitBranch className="w-4 h-4" />
        </button>

        {/* Note Editor View */}
        <button
          onClick={() => setActiveView('note')}
          className={`p-2 rounded-lg transition ${
            activeView === 'note'
              ? 'text-obsidian-purple bg-obsidian-hover'
              : 'text-obsidian-textMuted hover:text-obsidian-text hover:bg-obsidian-hover'
          }`}
          title="Open Note Editor"
        >
          <BookOpen className="w-4 h-4" />
        </button>

        {/* Quick New Note */}
        <button
          onClick={() => {
            const title = prompt('Enter note title:');
            if (title && title.trim()) {
              createNote(title.trim());
            }
          }}
          className="p-2 text-obsidian-textMuted hover:text-obsidian-text hover:bg-obsidian-hover rounded-lg transition"
          title="Create new note"
        >
          <Plus className="w-4 h-4" />
        </button>

        <div className="w-5 h-px bg-obsidian-border my-1" />

        {/* Claude AI Assistant Icon */}
        <button
          onClick={toggleClaude}
          className={`p-2 rounded-lg transition relative ${
            isClaudeOpen
              ? 'text-obsidian-claude bg-obsidian-claudeBg'
              : 'text-obsidian-textMuted hover:text-obsidian-claude hover:bg-obsidian-hover'
          }`}
          title="Toggle Claude AI Assistant"
        >
          <Sparkles className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-obsidian-claude" />
        </button>
      </div>

      {/* Bottom Settings Icon */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => {
            const newKey = prompt('Enter Anthropic API Key for live Claude calls (or leave blank to use simulated model):');
            if (newKey !== null) {
              window.localStorage.setItem('anthropic_api_key', newKey.trim());
              window.location.reload();
            }
          }}
          className="p-2 text-obsidian-textMuted hover:text-obsidian-text hover:bg-obsidian-hover rounded-lg transition"
          title="Plugin Settings & API Key"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
