import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  Folder,
  GitBranch,
  Sparkles,
  Settings,
  Plus,
  BookOpen,
  HelpCircle,
} from 'lucide-react';

export const VaultRibbon: React.FC = () => {
  const {
    activeView,
    setActiveView,
    isAIOpen,
    toggleAI,
    isSidebarOpen,
    toggleSidebar,
    createNote,
  } = useWorkspace();

  return (
    <div className="w-10 sm:w-11 bg-black border-r border-[#1c1c1c] flex flex-col items-center justify-between py-2 flex-shrink-0 z-30 select-none">
      {/* Top action icons */}
      <div className="flex flex-col items-center gap-1.5">
        {/* Toggle Vault File Tree */}
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-lg transition ${
            isSidebarOpen
              ? 'text-white bg-[#181818]'
              : 'text-[#949494] hover:text-white hover:bg-[#121212]'
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
              ? 'text-[#9d4edd] bg-[#181818]'
              : 'text-[#949494] hover:text-white hover:bg-[#121212]'
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
              ? 'text-[#9d4edd] bg-[#181818]'
              : 'text-[#949494] hover:text-white hover:bg-[#121212]'
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
          className="p-2 text-[#949494] hover:text-white hover:bg-[#181818] rounded-lg transition"
          title="Create new note"
        >
          <Plus className="w-4 h-4" />
        </button>

        <div className="w-5 h-px bg-[#1c1c1c] my-1" />

        {/* AI Assistant Icon */}
        <button
          onClick={toggleAI}
          className={`p-2 rounded-lg transition relative ${
            isAIOpen
              ? 'text-[#9d4edd] bg-[#181818] shadow-[0_0_10px_rgba(157,78,221,0.3)]'
              : 'text-[#949494] hover:text-[#9d4edd] hover:bg-[#121212]'
          }`}
          title="Toggle AI Knowledge Assistant"
        >
          <Sparkles className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00ff88]" />
        </button>
      </div>

      {/* Bottom Settings Icon */}
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={() => {
            alert(
              'Brain Vault • Neural Graph & AI\n\n' +
                '• Left Ribbon: Files, Graph View, Note Editor, AI Assistant\n' +
                '• Graph Controls: Mouse drag to pan, Scroll to zoom, Click node to inspect, Drag node to reposition\n' +
                '• Graph Settings: Floating gear icon inside Graph View (Forces, Display, Groups, Filters)\n' +
                '• Wikilinks: Type [[Note Name]] in any note to automatically create bidirectional connections'
            );
          }}
          className="p-2 text-[#949494] hover:text-white hover:bg-[#181818] rounded-lg transition"
          title="Vault Information & Shortcuts"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            const key = prompt('Configure AI API Key (Anthropic / OpenAI / Gemini / DeepSeek):');
            if (key !== null) {
              // Quick helper
              alert('You can also configure API keys in the AI Assistant side panel under the Key icon or in .env.');
            }
          }}
          className="p-2 text-[#949494] hover:text-white hover:bg-[#181818] rounded-lg transition"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
