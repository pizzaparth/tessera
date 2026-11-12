import React, { useEffect, useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { VaultTitleBar } from '../components/vault/VaultTitleBar';
import { VaultFileTree } from '../components/vault/VaultFileTree';
import { GraphCanvas } from '../components/canvas/GraphCanvas';
import { VaultNoteEditor } from '../components/vault/VaultNoteEditor';
import { AIChatPlugin } from '../components/vault/AIChatPlugin';
import { VaultStatusBar } from '../components/vault/VaultStatusBar';
import { VaultModals } from '../components/modals/VaultModals';
import { QuickSwitcher } from '../components/modals/QuickSwitcher';
import { useWorkspaceShortcuts } from '../components/vault/shortcuts';
import '../components/landing/atlas/atlas.css';

/** Below this width the AI panel floats over the workspace instead of squeezing it. */
const AI_DOCK_MIN_WIDTH = 1280;
/** Below this width the sidebar floats over the workspace. */
const SIDEBAR_DOCK_MIN_WIDTH = 900;

const useViewportWidth = () => {
  const [width, setWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return width;
};

export const WorkspacePage: React.FC = () => {
  const { activeView, isAIOpen, toggleAI, isSidebarOpen, toggleSidebar, isQuickSwitcherOpen } = useWorkspace();
  useWorkspaceShortcuts();

  const viewportWidth = useViewportWidth();
  const aiFloating = viewportWidth < AI_DOCK_MIN_WIDTH;
  const sidebarFloating = viewportWidth < SIDEBAR_DOCK_MIN_WIDTH;
  // Split view needs room for both panes; fall back to the note on small screens
  const canSplit = viewportWidth >= 1024;
  const view = activeView === 'split' && !canSplit ? 'note' : activeView;

  return (
    <div className="vault-root fixed inset-0 h-screen w-screen flex flex-col overflow-hidden select-none z-30">
      <VaultTitleBar />

      <div className="flex-1 flex overflow-hidden relative">
        {sidebarFloating && isSidebarOpen && (
          <div className="absolute inset-0 z-30 bg-black/10 vault-fade-in" onClick={toggleSidebar} aria-hidden="true" />
        )}
        <VaultFileTree floating={sidebarFloating} />

        <main className="flex-1 min-w-0 flex overflow-hidden relative bg-white">
          {view === 'graph' && (
            <div className="w-full h-full">
              <GraphCanvas />
            </div>
          )}

          {view === 'note' && (
            <div className="w-full h-full">
              <VaultNoteEditor />
            </div>
          )}

          {view === 'split' && (
            <div className="w-full h-full flex">
              <div className="w-1/2 min-w-0 h-full">
                <VaultNoteEditor />
              </div>
              <div className="w-1/2 min-w-0 h-full border-l border-black/5">
                <GraphCanvas compact />
              </div>
            </div>
          )}
        </main>

        {aiFloating && isAIOpen && (
          <div className="absolute inset-0 z-30 bg-black/10 vault-fade-in" onClick={toggleAI} aria-hidden="true" />
        )}
        <AIChatPlugin floating={aiFloating} />
      </div>

      <VaultStatusBar />
      <VaultModals />
      {isQuickSwitcherOpen && <QuickSwitcher />}
    </div>
  );
};
