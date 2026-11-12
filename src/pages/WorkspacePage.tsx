import React, { useEffect, useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { VaultTitleBar } from '../components/vault/VaultTitleBar';
import { VaultRibbon } from '../components/vault/VaultRibbon';
import { VaultFileTree } from '../components/vault/VaultFileTree';
import { GraphCanvas } from '../components/canvas/GraphCanvas';
import { VaultNoteEditor } from '../components/vault/VaultNoteEditor';
import { AIChatPlugin } from '../components/vault/AIChatPlugin';
import { VaultStatusBar } from '../components/vault/VaultStatusBar';
import { VaultModals } from '../components/modals/VaultModals';
import { QuickSwitcher } from '../components/modals/QuickSwitcher';
import { useWorkspaceShortcuts } from '../components/vault/shortcuts';

/** Below this width the AI panel floats over the workspace instead of squeezing it. */
const AI_DOCK_MIN_WIDTH = 1280;

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
  const { activeView, isAIOpen, toggleAI, isQuickSwitcherOpen } = useWorkspace();
  useWorkspaceShortcuts();

  const viewportWidth = useViewportWidth();
  const aiFloating = viewportWidth < AI_DOCK_MIN_WIDTH;
  // Split view needs room for both panes; fall back to the note on small screens
  const canSplit = viewportWidth >= 1024;
  const view = activeView === 'split' && !canSplit ? 'note' : activeView;

  return (
    <div className="vault-root fixed inset-0 h-screen w-screen flex flex-col bg-black text-white overflow-hidden font-sans select-none z-30">
      <VaultTitleBar />

      <div className="flex-1 flex overflow-hidden relative">
        <VaultRibbon />
        <VaultFileTree />

        <main className="flex-1 min-w-0 flex overflow-hidden relative bg-black">
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
              <div className="w-1/2 min-w-0 h-full border-r border-[#1c1c1c]">
                <GraphCanvas compact />
              </div>
              <div className="w-1/2 min-w-0 h-full">
                <VaultNoteEditor />
              </div>
            </div>
          )}
        </main>

        {/* Dim the workspace behind the floating AI panel; click to dismiss */}
        {aiFloating && isAIOpen && (
          <div
            className="absolute inset-0 z-30 bg-black/50 vault-fade-in"
            onClick={toggleAI}
            aria-hidden="true"
          />
        )}
        <AIChatPlugin floating={aiFloating} />
      </div>

      <VaultStatusBar />
      <VaultModals />
      {isQuickSwitcherOpen && <QuickSwitcher />}
    </div>
  );
};
