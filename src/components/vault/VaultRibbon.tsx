import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Folder, GitBranch, Sparkles, Plus, BookOpen, HelpCircle, Search } from 'lucide-react';
import { MOD } from './shortcuts';

interface RibbonButtonProps {
  label: string;
  shortcut?: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const RibbonButton: React.FC<RibbonButtonProps> = ({ label, shortcut, active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`group relative p-2 rounded-lg transition-colors ${
      active ? 'text-[#b57aed] bg-[#181818]' : 'text-[#8a8a8a] hover:text-white hover:bg-[#141414]'
    }`}
    aria-label={label}
    aria-pressed={active}
  >
    {children}
    {/* Hover tooltip (native title is slow and unstyled) */}
    <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap rounded-md border border-[#262626] bg-[#111111] px-2 py-1 text-[11px] text-white opacity-0 shadow-xl transition-opacity duration-100 group-hover:opacity-100 group-focus-visible:opacity-100 z-50 flex items-center gap-2">
      {label}
      {shortcut && <kbd className="vault-kbd">{shortcut}</kbd>}
    </span>
  </button>
);

export const VaultRibbon: React.FC = () => {
  const {
    activeView,
    setActiveView,
    isAIOpen,
    toggleAI,
    isSidebarOpen,
    toggleSidebar,
    openCreateNoteModal,
    openHelpModal,
    openQuickSwitcher,
  } = useWorkspace();

  return (
    <nav
      className="w-11 bg-black border-r border-[#1c1c1c] flex flex-col items-center justify-between py-2 flex-shrink-0 z-40 select-none"
      aria-label="Workspace"
    >
      <div className="flex flex-col items-center gap-1">
        <RibbonButton
          label={isSidebarOpen ? 'Hide files' : 'Show files'}
          shortcut={`${MOD} B`}
          active={isSidebarOpen}
          onClick={toggleSidebar}
        >
          <Folder className="w-4 h-4" />
        </RibbonButton>
        <RibbonButton label="Search notes" shortcut={`${MOD} K`} onClick={openQuickSwitcher}>
          <Search className="w-4 h-4" />
        </RibbonButton>
        <RibbonButton label="New note" shortcut={`${MOD} Shift N`} onClick={openCreateNoteModal}>
          <Plus className="w-4 h-4" />
        </RibbonButton>

        <div className="w-5 h-px bg-[#1c1c1c] my-1" />

        <RibbonButton
          label="Graph view"
          shortcut={`${MOD} G`}
          active={activeView === 'graph' || activeView === 'split'}
          onClick={() => setActiveView('graph')}
        >
          <GitBranch className="w-4 h-4" />
        </RibbonButton>
        <RibbonButton
          label="Note editor"
          active={activeView === 'note' || activeView === 'split'}
          onClick={() => setActiveView('note')}
        >
          <BookOpen className="w-4 h-4" />
        </RibbonButton>
        <RibbonButton label="AI assistant" shortcut={`${MOD} J`} active={isAIOpen} onClick={toggleAI}>
          <Sparkles className="w-4 h-4" />
        </RibbonButton>
      </div>

      <div className="flex flex-col items-center gap-1">
        <RibbonButton label="Guide & shortcuts" shortcut="?" onClick={openHelpModal}>
          <HelpCircle className="w-4 h-4" />
        </RibbonButton>
      </div>
    </nav>
  );
};
