import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { ObsidianTitleBar } from '../components/obsidian/ObsidianTitleBar';
import { ObsidianRibbon } from '../components/obsidian/ObsidianRibbon';
import { ObsidianFileTree } from '../components/obsidian/ObsidianFileTree';
import { ObsidianGraphView } from '../components/obsidian/ObsidianGraphView';
import { ObsidianNoteEditor } from '../components/obsidian/ObsidianNoteEditor';
import { ClaudeChatPlugin } from '../components/obsidian/ClaudeChatPlugin';
import { ObsidianStatusBar } from '../components/obsidian/ObsidianStatusBar';

export const WorkspacePage: React.FC = () => {
  const { activeView } = useWorkspace();

  return (
    <div className="h-screen w-screen flex flex-col bg-obsidian-bg text-obsidian-text overflow-hidden font-sans">
      {/* 1. Obsidian Top Title Bar */}
      <ObsidianTitleBar />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Leftmost Activity Ribbon */}
        <ObsidianRibbon />

        {/* Collapsible File Explorer Sidebar */}
        <ObsidianFileTree />

        {/* Center Main Canvas: Graph View / Note Editor / Split */}
        <main className="flex-1 flex overflow-hidden relative">
          {activeView === 'graph' && (
            <div className="w-full h-full">
              <ObsidianGraphView />
            </div>
          )}

          {activeView === 'note' && (
            <div className="w-full h-full">
              <ObsidianNoteEditor />
            </div>
          )}

          {activeView === 'split' && (
            <div className="w-full h-full flex">
              <div className="w-1/2 h-full border-r border-obsidian-border">
                <ObsidianGraphView />
              </div>
              <div className="w-1/2 h-full">
                <ObsidianNoteEditor />
              </div>
            </div>
          )}
        </main>

        {/* Rightmost Claude AI Assistant Plugin */}
        <ClaudeChatPlugin />
      </div>

      {/* 3. Obsidian Bottom Status Bar */}
      <ObsidianStatusBar />
    </div>
  );
};
