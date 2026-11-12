import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Sparkles, GitBranch, CheckCircle2, HelpCircle } from 'lucide-react';
import { modelDisplayName } from './AIChatPlugin';

export const VaultStatusBar: React.FC = () => {
  const { nodes, edges, selectedNode, statusNotification, toggleAI, activeModel, activeView, openHelpModal } =
    useWorkspace();

  const wordCount = selectedNode ? selectedNode.content.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <footer className="h-6 bg-black border-t border-[#1c1c1c] px-3 flex items-center justify-between gap-3 text-[11px] text-[#8a8a8a] select-none flex-shrink-0 z-40">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <GitBranch className="w-3 h-3 text-[#9d4edd]" />
          <span className="tabular-nums">{nodes.length} notes</span>
          <span className="text-[#3a3a3a]">·</span>
          <span className="tabular-nums">{edges.length} links</span>
        </div>

        {/* Transient notification (announced to screen readers) */}
        <div className="min-w-0" role="status" aria-live="polite">
          {statusNotification && (
            <div key={statusNotification} className="flex items-center gap-1.5 text-[#4ade80] vault-fade-in min-w-0">
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{statusNotification}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {selectedNode && activeView !== 'graph' && (
          <span className="hidden sm:inline tabular-nums">{wordCount} words</span>
        )}
        <button onClick={openHelpModal} className="hidden sm:flex items-center gap-1 hover:text-white transition-colors">
          <HelpCircle className="w-3 h-3" />
          Shortcuts
        </button>
        <button onClick={toggleAI} className="flex items-center gap-1 text-[#b57aed] hover:text-white transition-colors">
          <Sparkles className="w-3 h-3" />
          <span className="truncate max-w-[160px]">{modelDisplayName(activeModel)}</span>
        </button>
      </div>
    </footer>
  );
};
