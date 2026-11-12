import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Sparkles, GitBranch, FileText, CheckCircle2 } from 'lucide-react';

export const VaultStatusBar: React.FC = () => {
  const {
    nodes,
    edges,
    selectedNode,
    statusNotification,
    isAIOpen,
    toggleAI,
    activeModel,
    activeProvider,
  } = useWorkspace();

  const wordCount = selectedNode
    ? selectedNode.content.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const charCount = selectedNode ? selectedNode.content.length : 0;

  return (
    <footer className="h-6 bg-black border-t border-[#1c1c1c] px-3 flex items-center justify-between text-[11px] text-[#949494] select-none flex-shrink-0 z-40">
      {/* Left info */}
      <div className="flex items-center gap-3">
        <span className="font-semibold text-white">Brain Vault</span>
        <span className="text-[#333333]">|</span>
        <div className="flex items-center gap-1.5">
          <GitBranch className="w-3 h-3 text-[#9d4edd]" />
          <span>{nodes.length} notes</span>
          <span className="text-[#333333]">•</span>
          <span>{edges.length} connections</span>
        </div>

        {/* Transient notification */}
        {statusNotification && (
          <div className="flex items-center gap-1.5 text-[#00ff88] font-medium ml-2">
            <CheckCircle2 className="w-3 h-3" />
            <span>{statusNotification}</span>
          </div>
        )}
      </div>

      {/* Right info: active note words & AI status */}
      <div className="flex items-center gap-3">
        {selectedNode && (
          <div className="flex items-center gap-1.5 text-[#949494]">
            <FileText className="w-3 h-3" />
            <span>{wordCount} words</span>
            <span className="text-[#333333]">•</span>
            <span>{charCount} chars</span>
          </div>
        )}

        <span className="text-[#333333]">|</span>

        <button
          onClick={toggleAI}
          className="flex items-center gap-1 text-[#9d4edd] hover:text-white transition font-medium"
        >
          <Sparkles className="w-3 h-3" />
          <span>
            {activeModel} ({activeProvider})
          </span>
        </button>
      </div>
    </footer>
  );
};
