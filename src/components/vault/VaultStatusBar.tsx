import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Check } from 'lucide-react';
import { modelDisplayName } from './AIChatPlugin';

export const VaultStatusBar: React.FC = () => {
  const { nodes, edges, selectedNode, statusNotification, activeModel, activeView } = useWorkspace();

  const wordCount = selectedNode ? selectedNode.content.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <footer className="h-7 bg-white border-t border-black/5 px-4 flex items-center justify-between gap-3 text-[12px] text-black/45 select-none flex-shrink-0 z-40">
      <div className="flex items-center gap-3 min-w-0">
        <span className="tabular-nums whitespace-nowrap">
          {nodes.length} notes · {edges.length} links
        </span>
        <div className="min-w-0" role="status" aria-live="polite">
          {statusNotification && (
            <div key={statusNotification} className="flex items-center gap-1.5 text-[#6d55bd] vault-fade-in min-w-0">
              <Check className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{statusNotification.replace(/^✨\s*/, '')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {selectedNode && activeView !== 'graph' && <span className="hidden sm:inline tabular-nums">{wordCount} words</span>}
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]" aria-hidden="true" />
          {modelDisplayName(activeModel)}
        </span>
      </div>
    </footer>
  );
};
