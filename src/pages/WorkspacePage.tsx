import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { VaultTitleBar } from '../components/vault/VaultTitleBar';
import { VaultRibbon } from '../components/vault/VaultRibbon';
import { VaultFileTree } from '../components/vault/VaultFileTree';
import { GraphCanvas } from '../components/canvas/GraphCanvas';
import { VaultNoteEditor } from '../components/vault/VaultNoteEditor';
import { AIChatPlugin } from '../components/vault/AIChatPlugin';
import { VaultStatusBar } from '../components/vault/VaultStatusBar';
import { VaultModals } from '../components/modals/VaultModals';

export const WorkspacePage: React.FC = () => {
  const { activeView } = useWorkspace();

  return (
    <div className="fixed inset-0 h-screen w-screen flex flex-col bg-black text-white overflow-hidden font-sans select-none z-30">
      {/* 1. Top Title Bar */}
      <VaultTitleBar />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Leftmost Activity Ribbon */}
        <VaultRibbon />

        {/* Collapsible File Explorer Sidebar */}
        <VaultFileTree />

        {/* Center Main Canvas: Graph View / Note Editor / Split */}
        <main className="flex-1 flex overflow-hidden relative bg-black">
          {activeView === 'graph' && (
            <div className="w-full h-full">
              <GraphCanvas />
            </div>
          )}

          {activeView === 'note' && (
            <div className="w-full h-full">
              <VaultNoteEditor />
            </div>
          )}

          {activeView === 'split' && (
            <div className="w-full h-full flex">
              <div className="w-1/2 h-full border-r border-[#1c1c1c]">
                <GraphCanvas />
              </div>
              <div className="w-1/2 h-full">
                <VaultNoteEditor />
              </div>
            </div>
          )}
        </main>

        {/* Rightmost Universal AI Assistant Plugin */}
        <AIChatPlugin />
      </div>

      {/* 3. Bottom Status Bar */}
      <VaultStatusBar />

      {/* 4. In-System Dialogs & Modals */}
      <VaultModals />
    </div>
  );
};
